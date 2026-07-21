import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const EXCLUDED_FROM_RETRY = ["/auth/login", "/auth/refresh"];

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const isExcludedFromRetry = EXCLUDED_FROM_RETRY.some((path) =>
      originalRequest?.url?.startsWith(path),
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isExcludedFromRetry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
