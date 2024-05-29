import { UserCredentials } from "./user-credentials-interface";

export interface RegisterSuccessCredentials {
  id: number;
  fullName: string;
  userCredentials: UserCredentials;
}
