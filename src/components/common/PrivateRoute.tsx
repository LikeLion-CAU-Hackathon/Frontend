import { Navigate, Outlet, useLocation } from "react-router-dom";

// 로그인 시에만 접근 가능하게 루트 설정
const PrivateRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

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