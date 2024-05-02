import { axiosInstance } from "@/api.config";
import { noInterceptorsAxiosInstance } from "@/api.config";

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
    const data = await axiosInstance.post<any>("/auth/refresh");
    if (data.status === 401) {
      throw Error;
    }
    return data;
  },

  async getRoles() {
    const { data } = await axiosInstance.get<any>("/auth/roles");
    return data;
  },

  async validate() {
    const { data } = await noInterceptorsAxiosInstance.get<any>(
      "/auth/validate"
    );
    return data;
  },
};
