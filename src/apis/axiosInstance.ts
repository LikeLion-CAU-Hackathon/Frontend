// src/apis/axiosInstance.ts
import axios from "axios";
import { BASE_URL } from "../constants/baseURL";
import { clearToken, getAccessToken } from "../utils/token";

export const axiosAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


axiosAPI.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      clearToken();
    }
    return Promise.reject(error);
  }
);
