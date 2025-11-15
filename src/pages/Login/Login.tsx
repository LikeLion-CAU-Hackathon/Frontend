import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../components/common/GoogleLoginButton/GoogleLoginButton";
import styles from "./Login.module.css";
import envelopesStackImg from "../../assets/images/letters.svg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasAuthCode = params.has("code");
    const loginStatus = params.get("login");
    const token = params.get("token");
    const hasError = params.has("error");

    if (hasError || (!token && !hasAuthCode && loginStatus !== "success")) return;

    if (token) {
      localStorage.setItem("access_token", token);
    }

    const redirectParam = params.get("redirect");
    const redirectPath = redirectParam
      ? redirectParam.startsWith("/")
        ? redirectParam
        : `/${redirectParam}`
      : "/calendar";

    navigate(redirectPath, { replace: true });
  }, [location.search, navigate]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Likelion Postbox:</h1>
        <h2 className={styles.subtitle}>2025 Advent Calendar</h2>
      </header>

      <main className={styles.content}>
        <img
          src={envelopesStackImg}
          alt="Stacked envelopes"
          className={styles.envelopes}
        />
      </main>

      <footer className={styles.footer}>
        <GoogleLoginButton />
      </footer>
    </div>
  );
};

export default Login;