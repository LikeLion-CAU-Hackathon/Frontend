import axios, { type AxiosRequestHeaders } from "axios";
import { BASE_URL } from "../constants/baseURL";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setTokens,
  clearTokens,
} from "../utils/token.ts";
import { getNewRefreshToken } from "./auth.ts";

export const axiosAPI = (initialToken?: string) => {
  const authAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
  });

  authAxios.interceptors.request.use((config) => {
    const latestAccess = getAccessToken() || initialToken;

    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    if (latestAccess) {
      config.headers.Authorization = `Bearer ${latestAccess}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  });

  // 401 → refreshToken으로 재발급
  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        getRefreshToken()
      ) {
        originalRequest._retry = true;

        try {
          const result = await getNewRefreshToken();

          const newAccess = result.accessToken || result.access || null;
          const newRefresh = result.refreshToken || result.refresh || null;

          if (newAccess && newRefresh) {
            setTokens(newAccess, newRefresh);
          } else if (newAccess) {
            setAccessToken(newAccess);
          } else {
            throw new Error("Token refresh failed");
          }

          if (!originalRequest.headers) {
            originalRequest.headers = {} as AxiosRequestHeaders;
          }
          originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;

          originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;

          return axios(originalRequest);
        } catch (refreshError) {
          // 강제 로그아웃
          clearTokens();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return authAxios;
};
