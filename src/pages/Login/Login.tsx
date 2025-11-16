import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../components/common/GoogleLoginButton/GoogleLoginButton";
import styles from "./Login.module.css";
import envelopesStackImg from "../../assets/images/letters.svg";
import { setAccessToken } from "../../utils/token";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hashString = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : location.hash;
    const hashParams = new URLSearchParams(hashString);

    const pickToken = (search: URLSearchParams) => {
      const tokenKeys = ["token", "access_token", "accessToken"];
      for (const key of tokenKeys) {
        const value = search.get(key);
        if (value) return value;
      }
      return null;
    };

    const hasAuthCode = params.has("code") || hashParams.has("code");
    const loginStatus = params.get("login") ?? hashParams.get("login");
    const token = pickToken(params) ?? pickToken(hashParams);
    const hasError = params.has("error") || hashParams.has("error");

    if (hasError || (!token && !hasAuthCode && loginStatus !== "success")) return;

    if (token) {
      setAccessToken(token);
    }

    const redirectParam = params.get("redirect");
    const redirectPath = redirectParam
      ? redirectParam.startsWith("/")
        ? redirectParam
        : `/${redirectParam}`
      : "/calendar";

    navigate(redirectPath, { replace: true });
  }, [location.search, location.hash, navigate]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Likelion Postbox</h1>
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
