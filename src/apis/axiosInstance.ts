import axios from "axios";
import { BASE_URL } from "../constants/baseURL";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setTokens,
  clearTokens,
} from "../utils/token.ts";
import { getNewRefreshToken } from "./auth.ts";

export const authAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

authAxios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const result = await getNewRefreshToken();

        const newAccess = result.accessToken;
        const newRefresh = result.refreshToken;

        if (newAccess && newRefresh) {
          setTokens(newAccess, newRefresh);
        } else if (newAccess) {
          setAccessToken(newAccess);
        }

        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;

        return authAxios(originalRequest); 
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
