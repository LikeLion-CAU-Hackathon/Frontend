const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const getAccessToken = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  console.log("getAccessToken:", token);
  return token;
};

export const getRefreshToken = () => {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  console.log("getRefreshToken:", token);
  return token;
};

export const setTokens = (access: string, refresh: string) => {
  console.log("setTokens:", { access, refresh });
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  console.log("Tokens saved to localStorage");
};

export const setAccessToken = (access: string) => {
  console.log("💾 setAccessToken called:", access);
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  console.log("Access token saved to localStorage");
  
  // 저장 확인
  const saved = localStorage.getItem(ACCESS_TOKEN_KEY);
  console.log("Verification - saved token:", saved);
};

export const clearTokens = () => {
  console.log("clearTokens called");
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.location.href = "/";
};