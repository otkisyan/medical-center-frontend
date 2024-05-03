import { IUserDetails } from "./userDetails.interface";

export interface IUserContext {
  userDetails: IUserDetails | null;
  //register: (username: string, password: string) => void
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}
