import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export const createClient = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is not signed in and the current path is not public, redirect to login
  if (!session && !PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname);
    return { response: NextResponse.redirect(redirectUrl) };
  }

  // If user is signed in and the current path is a public path, redirect to dashboard
  if (session && PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return { response: NextResponse.redirect(new URL("/dashboard", request.url)) };
  }

  return { supabase, response };
};

// This is a middleware function that can be used in your Next.js middleware
export async function middleware(request: NextRequest) {
  const result = await createClient(request);
  return 'response' in result ? result.response : NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth/callback (auth callback routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)",
  ],
};
