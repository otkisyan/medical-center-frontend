const protectedRoutes = {
  "/patients": ["ROLE_DOCTOR", "ROLE_RECEPTIONIST", "ROLE_ADMIN"],
};

export default protectedRoutes;
