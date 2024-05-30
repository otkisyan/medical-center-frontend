export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const initialChangePasswordRequestState: ChangePasswordRequest = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
