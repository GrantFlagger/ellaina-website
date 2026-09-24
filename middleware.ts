import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";

// Refreshes the InsForge access token cookie before pages and server
// actions run, so a signed-in customer stays signed in.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|og/|videos/|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|mp4|webm)$).*)",
  ],
};
