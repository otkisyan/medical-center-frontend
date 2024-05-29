import { Role } from "../enum/role";

const protectedRoutes = {
  "/patients": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
  "/doctors": [Role.ADMIN, Role.RECEPTIONIST],
  "/appointments": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
  "/offices": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
  "/receptionists": [Role.ADMIN],
};

export default protectedRoutes;
