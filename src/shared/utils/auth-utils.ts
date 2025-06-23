import protectedRoutes from "@/shared/constants/protected-routes";
import { Role } from "../enum/role";

export const isProtectedRoute = (pathname: string): boolean => {
  return Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  );
};

export const hasSufficientRole = (
  pathname: string,
  userRoles: Role[] | null
): boolean => {
  if (!userRoles) return false;

  // sorts routes by descending key length (string paths).
  // routes with longer paths come first, followed by those with shorter paths.
  const sortedRoutes = Object.entries(protectedRoutes).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [route, roles] of sortedRoutes) {
    if (pathname.startsWith(route)) {
      return userRoles.some((role) => roles.includes(role));
    }
  }

  return false;
};

export const convertStringRolesToEnumRole = (roles: string[]): Role[] => {
  return roles.map((role: string) => {
    const matchingRole = Object.values(Role).find((r) => r === role);
    if (matchingRole) {
      return matchingRole;
    } else {
      throw new Error(`Unknown role: ${role}`);
    }
  });
};
