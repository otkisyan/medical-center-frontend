import protectedRoutes from "@/shared/constants/protectedRoutes";

export const isProtectedRoute = (pathname: string): boolean => {
  return Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  );
};

export const hasSufficientRole = (
  pathname: string,
  userRoles: string[]
): boolean => {
  return Object.entries(protectedRoutes).some(([route, roles]) => {
    if (pathname.startsWith(route)) {
      return userRoles.some((role) => roles.includes(role));
    }
    return false;
  });
};
