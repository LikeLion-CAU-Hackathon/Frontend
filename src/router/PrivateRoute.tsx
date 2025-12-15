import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// 로그인 시에만 접근 가능하게 루트 설정
const PrivateRoute = () => {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null;
  }

  if (!token) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

