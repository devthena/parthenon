import Link from 'next/link';
import styles from '@/styles/footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>made with ♡ by athena</p>
      <p>
        <Link href="/terms-of-service" target="_blank">
          TERMS OF SERVICE
        </Link>{' '}
        |{' '}
        <Link href="/privacy-policy" target="_blank">
          PRIVACY POLICY
        </Link>
      </p>
    </footer>
  );
};
