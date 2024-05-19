import { Role } from "@/shared/enum/role";
import { UserDetails } from "./user-details-interface";

export interface UserContext {
  userDetails: UserDetails | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}
