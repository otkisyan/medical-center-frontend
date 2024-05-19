import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  convertStringRolesToEnumRole,
  isProtectedRoute,
} from "@/shared/utils/auth-utils";
import { hasSufficientRole } from "@/shared/utils/auth-utils";
import { Role } from "./shared/enum/role";

const isAuthenticated = async (request: NextRequest) => {
  const refreshToken = request.cookies.get("refreshToken");
  try {
    const response = await fetch("http://localhost:8080/auth/validate", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken?.value}`,
      },
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const getUserRoles = async (request: NextRequest) => {
  const refreshToken = request.cookies.get("refreshToken");
  try {
    const response = await fetch("http://localhost:8080/auth/details", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken?.value}`,
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      return convertStringRolesToEnumRole(responseData.roles);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedRoute(pathname)) {
    const isAuth = await isAuthenticated(request);
    const userRoles = await getUserRoles(request);
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    } else if (!hasSufficientRole(request.nextUrl.pathname, userRoles)) {
      return new Response("Access Denied", { status: 403 });
    }
  }

  if (pathname.startsWith("/login")) {
    const isAuth = await isAuthenticated(request);
    if (isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "/") {
    const isAuth = await isAuthenticated(request);
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
