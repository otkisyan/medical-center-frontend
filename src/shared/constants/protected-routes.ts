import { Role } from "../enum/role";

const protectedRoutes = {
  "/patients": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
  "/doctors": [Role.ADMIN, Role.RECEPTIONIST],
  "/appointments": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
  "/offices": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
  "/offices/new": [Role.ADMIN],
  "/receptionists": [Role.ADMIN],
  "/user": [Role.ADMIN, Role.RECEPTIONIST, Role.Doctor],
};

export default protectedRoutes;
