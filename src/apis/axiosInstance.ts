import axios from "axios";
import { BASE_URL } from "../constants/baseURL";

export const axiosAPI = axios.create({
  baseURL: BASE_URL,
});

axiosAPI.interceptors.request.use((config) => {
    const latestToken = localStorage.getItem('accessToken') || initialToken;
    if (!config.headers) config.headers = {};
    if (latestToken) {
      config.headers.Authorization = `Bearer ${latestToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  });
axiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
