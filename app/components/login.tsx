import styles from '../styles/login.module.scss';

export const Login = () => {
  return (
    <a className={styles.login} href="/api/auth/login">
      LOGIN
    </a>
  );
};
