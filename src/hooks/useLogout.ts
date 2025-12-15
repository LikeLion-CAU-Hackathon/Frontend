import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/token";

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    clearTokens(); 
    navigate("/", { replace: true });
  };
}
