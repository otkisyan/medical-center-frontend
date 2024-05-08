import { IUserDetails } from "./userDetails.interface";

export interface IUserContext {
  userDetails: IUserDetails | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}
