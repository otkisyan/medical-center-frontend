import { UserDetails } from "./user-details-interface";

export interface UserContext {
  userDetails: UserDetails | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}
