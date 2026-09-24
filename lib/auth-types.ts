export type WishlistProduct = {
  id: string;
  slug: string;
  name: { el: string; en: string };
  image: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  wishlist?: WishlistProduct[];
};

/** Error codes the auth forms translate into user-facing messages. */
export type AuthErrorCode =
  | "invalid_credentials"
  | "email_not_verified"
  | "email_taken"
  | "invalid_code"
  | "weak_password"
  | "not_signed_in"
  | "unknown";

export type ActionResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; code: AuthErrorCode; message: string };
