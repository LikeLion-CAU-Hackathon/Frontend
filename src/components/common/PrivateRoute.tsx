import { Navigate, Outlet } from "react-router-dom";

// 로그인 시에만 접근 가능하게 루트 설정
const isLogin = !!localStorage.getItem("access_token");

const PrivateRoute = () => {
    return isLogin ? <Outlet /> : <Navigate to = "/" replace/>
}

export default PrivateRoute;