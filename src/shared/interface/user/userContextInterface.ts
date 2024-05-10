import { UserDetails } from "./userDetailsInterface";

export interface UserContext {
  userDetails: UserDetails | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}
