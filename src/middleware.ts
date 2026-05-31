import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  convertStringRolesToEnumRole,
  isProtectedRoute,
} from "@/shared/utils/auth-utils";
import { hasSufficientRole } from "@/shared/utils/auth-utils";
import { verifyToken } from "@/shared/utils/auth-utils";
import { Role } from "./shared/enum/role";

// const API_BASE_URL_SERVER = process.env.NEXT_PUBLIC_API_BASE_URL_SERVER;

// const isAuthenticated = async (request: NextRequest) => {
//   const refreshToken = request.cookies.get("refreshToken");
//   if (!refreshToken) {
//     return false;
//   }
//   try {
//     const response = await fetch(`${API_BASE_URL_SERVER}/user/validate`, {
//       method: "GET",
//       cache: "no-store",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Cookie: `refreshToken=${refreshToken?.value}`,
//       },
//     });
//     if (response.ok) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
// };

// const getUserRoles = async (request: NextRequest) => {
//   const refreshToken = request.cookies.get("refreshToken");
//   if (!refreshToken) {
//     return null;
//   }
//   try {
//     const response = await fetch(`${API_BASE_URL_SERVER}/user/details`, {
//       method: "GET",
//       cache: "no-store",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Cookie: `refreshToken=${refreshToken?.value}`,
//       },
//     });
//     if (response.ok) {
//       const responseData = await response.json();
//       let roles: Role[];
//       try {
//         roles = convertStringRolesToEnumRole(responseData.roles);
//         return roles;
//       } catch (error) {
//         return null;
//       }
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return null;
//   }
// };

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refreshToken")?.value;
  const isProtected = isProtectedRoute(pathname);

  if (!token) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("refreshToken");
    return res;
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtected) {
    const roles = convertStringRolesToEnumRole(
      (payload.roles as string[]) || [],
    );

    if (!hasSufficientRole(pathname, roles)) {
      return new Response("Access Denied", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
