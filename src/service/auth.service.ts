import { axiosInstance } from "@/api.config";

export const AuthService = {
  async loginUser(username: string, password: string) {
    const data = await axiosInstance.post<any>("/auth/login", {
      username: username,
      password: password,
    });
    return data;
  },

  async registerUser(username: string, password: string) {
    const data = await axiosInstance.post<String>("/auth/register", {
      username: username,
      password: password,
    });
    return data;
  },

  async refresh() {
    const data = await axiosInstance.post<any>("/auth/refresh");
    if (data.status === 401) {
      throw Error;
    }
    return data;
  },
};
