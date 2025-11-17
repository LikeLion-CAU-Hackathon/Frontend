import { Navigate, Outlet, useLocation } from "react-router-dom";

// 로그인 시에만 접근 가능하게 루트 설정
const PrivateRoute = () => {
  const location = useLocation();
  const isLogin = !!localStorage.getItem("access_token");

  if (isLogin) {
    return <Outlet />;
  }

  // OAuth redirect가 /calendar#token 형태로 들어올 때 해시를 제거하지 않도록 유지
  if (location.pathname === "/calendar" && location.hash) {
    return (
      <Navigate
        to={{ pathname: "/calendar", hash: location.hash }}
        replace
      />
    );
  }

  // 기본적으로는 로그인 페이지로 보냄
  return <Navigate to="/" replace />;
};

export default PrivateRoute;