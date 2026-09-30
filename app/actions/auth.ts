"use server";

import {
  createInsForgeAuthActions,
  createInsForgeServerClient,
} from "@/lib/insforge-server";
import type { ActionResult, AuthErrorCode, AuthUser } from "@/lib/auth-types";
import { CUSTOMER_AUTH_ENABLED } from "@/lib/availability";

type SdkUser = {
  id: string;
  email: string;
  profile?: Record<string, unknown> | null;
};

type SdkError = { statusCode?: number; message?: string; error?: string } | null;

function toAuthUser(user: SdkUser): AuthUser {
  const profile = user.profile ?? {};
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  return {
    id: user.id,
    email: user.email,
    name: str(profile.name) ?? user.email.split("@")[0],
    phone: str(profile.phone),
    gender: str(profile.gender),
  };
}

function fail(error: SdkError, fallback: AuthErrorCode = "unknown"): ActionResult<never> {
  const message = error?.message ?? "Something went wrong";
  const text = `${error?.error ?? ""} ${message}`.toLowerCase();
  let code: AuthErrorCode = fallback;
  if (error?.statusCode === 403) code = "email_not_verified";
  else if (error?.statusCode === 409 || text.includes("exist") || text.includes("already")) code = "email_taken";
  else if (text.includes("password") && (text.includes("least") || text.includes("weak") || text.includes("length"))) code = "weak_password";
  return { ok: false, code, message };
}

const clean = (s: string) => s.trim().toLowerCase();

function authUnavailable<T>(): ActionResult<T> {
  return { ok: false, code: "unknown", message: "Customer sign-in and registration are temporarily unavailable" };
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const insforge = createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) return null;
  return toAuthUser(data.user);
}

export async function signIn(
  email: string,
  password: string,
): Promise<ActionResult<{ user: AuthUser }>> {
  if (!CUSTOMER_AUTH_ENABLED) return authUnavailable();

  const auth = createInsForgeAuthActions();
  const { data, error } = await auth.signInWithPassword({ email: clean(email), password });
  if (error || !data?.user) return fail(error, "invalid_credentials");
  return { ok: true, user: toAuthUser(data.user) };
}

export async function signUp(input: {
  email: string;
  password: string;
  name: string;
}): Promise<ActionResult<{ needsVerification: boolean; user: AuthUser | null }>> {
  if (!CUSTOMER_AUTH_ENABLED) return authUnavailable();

  const auth = createInsForgeAuthActions();
  const { data, error } = await auth.signUp({
    email: clean(input.email),
    password: input.password,
    name: input.name.trim() || undefined,
  });
  if (error || !data) return fail(error);
  if (data.requireEmailVerification) return { ok: true, needsVerification: true, user: null };
  return {
    ok: true,
    needsVerification: false,
    user: data.user ? toAuthUser(data.user) : null,
  };
}

/** Confirms the 6-digit sign-up code; signs the customer in on success. */
export async function verifyEmail(
  email: string,
  otp: string,
): Promise<ActionResult<{ user: AuthUser }>> {
  if (!CUSTOMER_AUTH_ENABLED) return authUnavailable();

  const auth = createInsForgeAuthActions();
  const { data, error } = await auth.verifyEmail({ email: clean(email), otp: otp.trim() });
  if (error || !data?.user) return fail(error, "invalid_code");
  return { ok: true, user: toAuthUser(data.user) };
}

export async function resendVerification(email: string): Promise<ActionResult> {
  if (!CUSTOMER_AUTH_ENABLED) return authUnavailable();

  const insforge = createInsForgeServerClient();
  const { error } = await insforge.auth.resendVerificationEmail({ email: clean(email) });
  return error ? fail(error) : { ok: true };
}

export async function signOut(): Promise<void> {
  const auth = createInsForgeAuthActions();
  await auth.signOut();
}

export async function updateProfile(
  fields: Partial<Pick<AuthUser, "name" | "phone" | "gender">>,
): Promise<ActionResult<{ user: AuthUser }>> {
  const insforge = createInsForgeServerClient();
  const { data: current } = await insforge.auth.getCurrentUser();
  if (!current?.user) return { ok: false, code: "not_signed_in", message: "Not signed in" };

  const profile: Record<string, string> = {};
  for (const key of ["name", "phone", "gender"] as const) {
    const value = fields[key];
    if (typeof value === "string") profile[key] = value.trim().slice(0, 120);
  }
  const { error } = await insforge.auth.setProfile(profile);
  if (error) return fail(error);

  return {
    ok: true,
    user: toAuthUser({
      ...current.user,
      profile: { ...(current.user.profile ?? {}), ...profile },
    }),
  };
}

/** Emails a 6-digit reset code (the backend is configured for code resets). */
export async function sendPasswordReset(email: string): Promise<ActionResult> {
  const insforge = createInsForgeServerClient();
  const { error } = await insforge.auth.sendResetPasswordEmail({ email: clean(email) });
  return error ? fail(error) : { ok: true };
}

export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string,
): Promise<ActionResult> {
  const insforge = createInsForgeServerClient();
  const { data, error } = await insforge.auth.exchangeResetPasswordToken({
    email: clean(email),
    code: code.trim(),
  });
  if (error || !data?.token) return fail(error, "invalid_code");
  return resetPasswordWithToken(data.token, newPassword);
}

/** For link-based resets, where the emailed link carries `?token=`. */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<ActionResult> {
  const insforge = createInsForgeServerClient();
  const { error } = await insforge.auth.resetPassword({ newPassword, otp: token });
  return error ? fail(error, "invalid_code") : { ok: true };
}
