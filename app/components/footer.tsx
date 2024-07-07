import Link from 'next/link';
import styles from '../styles/footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>Made with ♡ by Athena | Build v1.0.0</p>
      <p>
        <Link href="/terms-of-service" target="_blank">
          Terms of Service
        </Link>
      </p>
    </footer>
  );
};
