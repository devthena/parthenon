import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MenuCloseIcon, MenuIcon } from '../images/icons';
import { Login } from './login';
import { NavPaths } from '../lib/constants';

import styles from '../styles/header.module.scss';

export const Header = ({ hasAuth = true }: { hasAuth?: boolean }) => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zIndex, setZIndex] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);

    setTimeout(() => {
      setZIndex(false);
    }, 250);
  };

  const handleModalOpen = () => {
    setZIndex(true);
    setIsModalOpen(true);
  };

  const modalClass = isModalOpen
    ? `${styles.modal} ${styles.open} ${styles.zIndexAdd}`
    : zIndex
    ? `${styles.modal} ${styles.zIndexAdd}`
    : styles.modal;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.menu}>
            {isModalOpen ? (
              <button onClick={handleModalClose}>
                <MenuCloseIcon />
              </button>
            ) : (
              <button onClick={handleModalOpen}>
                <MenuIcon />
              </button>
            )}
          </div>
          <a href="/">
            <Image
              alt="Little Owl"
              className={styles.logoImg}
              height={30}
              src="/owl.png"
              width={30}
            />
            <h1>
              LITTLEOWL<span>BOT</span>
            </h1>
          </a>
        </div>
        <nav className={styles.links}>
          {NavPaths.map(path => {
            const pathValue =
              path.value === '/' && hasAuth ? '/dashboard' : path.value;
            return (
              (hasAuth || !path.protected) && (
                <Link
                  className={
                    pathValue === pathname ? styles.selected : undefined
                  }
                  href={pathValue}
                  key={path.label}>
                  {path.label}
                </Link>
              )
            );
          })}
          {hasAuth ? (
            <a className={styles.logButton} href="/api/auth/logout">
              LOGOUT
            </a>
          ) : (
            <Login />
          )}
        </nav>
      </header>
      <div className={modalClass}>
        <div className={styles.modalContent}>
          <div className={styles.modalLinks}>
            {NavPaths.map(path => {
              const pathValue =
                path.value === '/' && hasAuth ? '/dashboard' : path.value;
              return (
                (hasAuth || !path.protected) && (
                  <Link
                    className={
                      pathValue === pathname ? styles.selected : undefined
                    }
                    href={pathValue}
                    key={path.label}
                    onClick={handleModalClose}>
                    {path.label}
                  </Link>
                )
              );
            })}
          </div>
          {hasAuth && (
            <a className={styles.logButton} href="/api/auth/logout">
              LOGOUT
            </a>
          )}
        </div>
      </div>
    </>
  );
};
