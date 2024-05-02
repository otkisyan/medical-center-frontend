import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8080",
});

export const noInterceptorsAxiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?._isRetry && error.response.status === 401) {
      window.location.href = "/login";
    }

    if (!originalRequest?._isRetry && error.response.status === 401) {
      originalRequest._isRetry = true;
      try {
        const resp = await noInterceptorsAxiosInstance.post("/auth/refresh");
        localStorage.setItem("access_token", resp?.data.accessToken);
        return axiosInstance.request(originalRequest);
      } catch (error) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
