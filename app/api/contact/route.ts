import { NextRequest, NextResponse } from "next/server";

const OUTLOOK_EMAIL = process.env.OUTLOOK_EMAIL?.trim() || "info@ellainaoliveoil.com";
const MAX_SUBMISSIONS = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const submissions = new Map<string, { count: number; expiresAt: number }>();

type Fields = Record<string, unknown>;

function text(fields: Fields, key: string, maxLength = 200) {
  return typeof fields[key] === "string" ? fields[key].trim().slice(0, maxLength) : "";
}

function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRateLimited(request: NextRequest) {
  const forwarded = request.headers.get("x-nf-client-connection-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? "unknown";
  const now = Date.now();
  const current = submissions.get(forwarded);

  if (!current || current.expiresAt <= now) {
    submissions.set(forwarded, { count: 1, expiresAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_SUBMISSIONS) return true;
  current.count += 1;
  return false;
}

async function sendOutlookMessage(input: {
  subject: string;
  content: string;
  replyTo: string;
}) {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    return { ok: false as const, status: 503 };
  }

  const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    const details = await tokenResponse.json().catch(() => ({})) as { error?: string };
    console.error("Microsoft OAuth token request failed", {
      status: tokenResponse.status,
      code: details.error ?? "unknown_error",
    });
    return { ok: false as const, status: 502 };
  }
  const token = (await tokenResponse.json()) as { access_token?: string };
  if (!token.access_token) {
    console.error("Microsoft OAuth response did not include an access token");
    return { ok: false as const, status: 502 };
  }

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(OUTLOOK_EMAIL)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: input.subject,
          body: { contentType: "Text", content: input.content },
          toRecipients: [{ emailAddress: { address: OUTLOOK_EMAIL } }],
          replyTo: [{ emailAddress: { address: input.replyTo } }],
        },
        saveToSentItems: true,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const details = await response.json().catch(() => ({})) as { error?: { code?: string } };
    console.error("Microsoft Graph sendMail failed", {
      status: response.status,
      code: details.error?.code ?? "unknown_error",
    });
    return { ok: false as const, status: 502 };
  }

  return { ok: true as const };
}

export async function POST(request: NextRequest) {
  let fields: Fields;
  try {
    fields = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (text(fields, "company_website", 500)) {
    return NextResponse.json({ ok: true });
  }
  if (isRateLimited(request)) {
    return NextResponse.json({ ok: false, error: "Too many submissions" }, { status: 429 });
  }

  const type = text(fields, "type", 30);
  const email = text(fields, "email", 254).toLowerCase();
  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address" }, { status: 400 });
  }

  let subject: string;
  let content: string;

  if (type === "contact") {
    const firstName = text(fields, "firstName", 100);
    const lastName = text(fields, "lastName", 100);
    const reason = text(fields, "reason", 200);
    const message = text(fields, "message", 5000);
    if (!firstName || !lastName || !reason || !message) {
      return NextResponse.json({ ok: false, error: "Complete the required fields" }, { status: 400 });
    }
    subject = `[Website contact] ${reason}`;
    content = [
      "New website contact message",
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Reason: ${reason}`,
      `Phone: ${text(fields, "phone", 40) || "Not provided"}`,
      "",
      message,
    ].join("\n");
  } else if (type === "b2b") {
    const businessName = text(fields, "businessName", 200);
    const contactName = text(fields, "contactName", 200);
    const message = text(fields, "message", 5000);
    if (!businessName || !contactName || !message) {
      return NextResponse.json({ ok: false, error: "Complete the required fields" }, { status: 400 });
    }
    subject = `[Website B2B inquiry] ${businessName}`;
    content = [
      "New B2B inquiry",
      `Business: ${businessName}`,
      `Contact: ${contactName}`,
      `Email: ${email}`,
      `Phone: ${text(fields, "phone", 40) || "Not provided"}`,
      `Language: ${text(fields, "language", 2)}`,
      "",
      message,
    ].join("\n");
  } else if (type === "restaurant") {
    const restaurantName = text(fields, "restaurantName", 200);
    const contactName = text(fields, "contactName", 200);
    const message = text(fields, "message", 5000);
    if (!restaurantName || !contactName || !message) {
      return NextResponse.json({ ok: false, error: "Complete the required fields" }, { status: 400 });
    }
    subject = `[Website restaurant inquiry] ${restaurantName}`;
    content = [
      "New restaurant inquiry",
      `Restaurant: ${restaurantName}`,
      `Contact: ${contactName}`,
      `Email: ${email}`,
      `Phone: ${text(fields, "phone", 40) || "Not provided"}`,
      `City: ${text(fields, "city", 100) || "Not provided"}`,
      `Language: ${text(fields, "language", 2)}`,
      "",
      message,
    ].join("\n");
  } else {
    return NextResponse.json({ ok: false, error: "Unknown form" }, { status: 400 });
  }

  try {
    const result = await sendOutlookMessage({ subject, content, replyTo: email });
    if (!result.ok) {
      console.error("Outlook form notification failed", result.status);
      return NextResponse.json({ ok: false, error: "Email could not be sent" }, { status: result.status });
    }
  } catch (error) {
    console.error("Outlook form notification failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ ok: false, error: "Email could not be sent" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}