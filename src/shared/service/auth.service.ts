import { axiosInstance } from "@/api.config";
import { noInterceptorsAxiosInstance } from "@/api.config";
import { IUserDetails } from "@/shared/interface/user/userDetails.interface";

export const AuthService = {
  async loginUser(username: string, password: string) {
    const data = await noInterceptorsAxiosInstance.post<any>("/auth/login", {
      username: username,
      password: password,
    });
    return data;
  },

  async registerUser(username: string, password: string) {
    const data = await noInterceptorsAxiosInstance.post<String>(
      "/auth/register",
      {
        username: username,
        password: password,
      }
    );
    return data;
  },

  async refresh() {
    const data = await noInterceptorsAxiosInstance.post<any>("/auth/refresh");
    if (data.status === 401) {
      throw Error;
    }
    return data;
  },

  async getUserDetails() {
    const { data } = await noInterceptorsAxiosInstance.get<IUserDetails>(
      "/auth/details"
    );
    return data;
  },

  async validate() {
    const { data } = await noInterceptorsAxiosInstance.get<any>(
      "/auth/validate"
    );
    return data;
  },
};
