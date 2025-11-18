import { useEffect } from "react";
import { setAccessToken, setTokens, getAccessToken } from "../utils/token";

interface UseAuthTokenParams {
  location: any;
  navigate: any;
}

export function useAuthTokenHandler({ location, navigate }: UseAuthTokenParams) {
  useEffect(() => {
    // 이미 토큰이 있다면 체크하지 않음
    if (getAccessToken()) {
      return;
    }

    const hash = location.hash.slice(1); // "#" 제거

    if (!hash) return;

    // 토큰 추출 함수
    const extractToken = (str: string, key: string) => {
      const regex = new RegExp(`${key}=([^&]*)`);
      const match = str.match(regex);
      return match ? decodeURIComponent(match[1]) : null;
    };

    // accessToken & refreshToken 추출
    const accessToken =
      extractToken(hash, "accessToken") ||
      extractToken(hash, "access_token");

    const refreshToken =
      extractToken(hash, "refreshToken") ||
      extractToken(hash, "refresh_token");

    // 토큰이 있으면 저장
    try {
      if (accessToken) {
        if (refreshToken) {
          setTokens(accessToken, refreshToken);
        } else {
          setAccessToken(accessToken);
        }

       // URL에서 hash 제거 (토큰을 URL에 남기지 않기 위해)
        navigate(location.pathname + location.search, { replace: true });
      }
    } catch (error) {
      console.error("토큰을 저장하는데 오류가 발생했습니다.", error);
    }
  }, [location.hash, location.pathname, location.search, navigate]);
}
