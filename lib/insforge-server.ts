import "server-only";
import { cookies } from "next/headers";
import { createAdminClient } from "@insforge/sdk";
import { createAuthActions, createServerClient } from "@insforge/sdk/ssr";

/** Acts as the signed-in visitor (or anon), using the auth cookies. */
export function createInsForgeServerClient() {
  return createServerClient({ cookies: cookies() });
}

/** Sign-in / sign-up / sign-out helpers that write the auth cookies. */
export function createInsForgeAuthActions() {
  return createAuthActions({ cookies: cookies() });
}

/**
 * Full-access admin client — bypasses RLS. Server-only: used to create
 * orders and Stripe checkout sessions with prices read from the database.
 */
export function createInsForgeAdminClient() {
  const apiKey = process.env.INSFORGE_API_KEY;
  if (!apiKey) throw new Error("INSFORGE_API_KEY is not set");
  return createAdminClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    apiKey,
  });
}
