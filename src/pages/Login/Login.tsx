import GoogleLoginButton from "../../components/common/GoogleLoginButton/GoogleLoginButton";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default Login;
