import { useEffect, useState } from "react";
import GoogleLoginButton from "../../components/common/googleloginbutton/GoogleLoginButton";
import styles from "./Login.module.css";

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === "complete") {
      setIsLoading(false);
      return;
    }

    window.addEventListener("load", handleLoad);
    const timeoutId = window.setTimeout(() => setIsLoading(false), 2000);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loadingOverlay} role="status" aria-live="polite">
          <div className={styles.spinner} />
          <p className={styles.loadingText}>로딩 중...</p>
        </div>
      )}
      <div className={styles.buttonWrapper}>
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default Login;
