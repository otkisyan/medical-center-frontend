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
  if (userRoles != null) {
    return Object.entries(protectedRoutes).some(([route, roles]) => {
      if (pathname.startsWith(route)) {
        return userRoles.some((role) => roles.includes(role));
      }
      return false;
    });
  } else {
    return false;
  }
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
