import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavPaths } from '../lib/constants';
import styles from '../styles/header.module.scss';

export const Header = ({ isProtected }: { isProtected: boolean }) => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">
          <Image alt="Little Owl" height={38} src="/owl.png" width={38} />
          <h1>
            LITTLEOWL<span>BOT</span>
          </h1>
        </a>
      </div>
      <nav className={styles.links}>
        {NavPaths.map(path => {
          const pathValue =
            path.value === '/' && isProtected ? '/dashboard' : path.value;
          return (
            (isProtected || !path.protected) && (
              <Link
                className={pathValue === pathname ? styles.selected : undefined}
                href={pathValue}
                key={path.label}>
                {path.label}
              </Link>
            )
          );
        })}
        {isProtected ? (
          <a className={styles.logButton} href="/api/auth/logout">
            LOGOUT
          </a>
        ) : (
          <a className={styles.logButton} href="/api/auth/login">
            LOGIN
          </a>
        )}
      </nav>
    </header>
  );
};
