import { Role } from "../enum/role";

const protectedRoutes = {
  "/patients": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
};

export default protectedRoutes;
