import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// 로그인 시에만 접근 가능하게 루트 설정
const PrivateRoute = () => {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 localStorage에서 토큰 확인
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
    setIsChecking(false);
  }, []);

  // 토큰 확인 중일 때는 아무것도 렌더링하지 않음 (또는 로딩 표시)
  if (isChecking) {
    return null; // 또는 <div>Loading...</div> 같은 로딩 UI
  }

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    // 현재 경로를 redirect 파라미터로 전달하여 로그인 후 원래 페이지로 돌아올 수 있게 함
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // 토큰이 있으면 자식 라우트 렌더링
  return <Outlet />;
};

export default PrivateRoute;