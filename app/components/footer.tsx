import Link from 'next/link';
import styles from '../styles/footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>Made with ♡ by Athena</p>
      <p>
        <Link href="/terms-of-service" target="_blank">
          Terms of Service
        </Link>{' '}
        |{' '}
        <Link href="/privacy-policy" target="_blank">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
};
