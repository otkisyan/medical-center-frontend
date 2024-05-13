import { axiosInstance } from "@/axios.config";
import { noInterceptorsAxiosInstance } from "@/axios.config";
import { UserDetails } from "@/shared/interface/user/user-details-interface";

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
    const { data } = await noInterceptorsAxiosInstance.get<UserDetails>(
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

  async logout() {
    const data = await noInterceptorsAxiosInstance.get<any>("/auth/logout");
    return data;
  },
};
