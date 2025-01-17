'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState } from 'react';

import { HEADER_PATHS } from '@/constants/navigation';
import { useParthenonState } from '@/context';
import { MenuCloseIcon, MenuIcon } from '@/images/icons';

import owl from '@/images/owl.png';
import styles from '@/styles/header.module.scss';

import { Login } from './login';

export const Header = () => {
  const { user } = useParthenonState();
  const { user: userAuth0 } = useUser();

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
              src={owl}
              width={30}
            />
            <h1>
              LITTLEOWL<span>BOT</span>
            </h1>
          </a>
        </div>
        <nav className={styles.links}>
          {HEADER_PATHS.map(path => {
            const pathValue =
              path.value === '/' && userAuth0 ? '/dashboard' : path.value;
            const isRestricted =
              path.value === '/games' && !user?.discord_username;

            const initialClass =
              path.label === 'Home' ? styles.home : undefined;
            const styleClass =
              pathValue === pathname
                ? `${styles.selected} ${initialClass}`
                : initialClass;

            return (
              (userAuth0 || !path.protected) &&
              !isRestricted && (
                <Link className={styleClass} href={pathValue} key={path.label}>
                  {path.label}
                </Link>
              )
            );
          })}
          {userAuth0 ? (
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
            {HEADER_PATHS.map(path => {
              const pathValue =
                path.value === '/' && userAuth0 ? '/dashboard' : path.value;

              const isRestricted =
                path.value === '/games' && !user?.discord_username;

              return (
                (userAuth0 || !path.protected) &&
                !isRestricted && (
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
          {userAuth0 && (
            <a className={styles.logButton} href="/api/auth/logout">
              LOGOUT
            </a>
          )}
        </div>
      </div>
    </>
  );
};
