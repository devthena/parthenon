'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

import { HEADER_PATHS } from '@/constants/navigation';
import { MenuCloseIcon, MenuIcon } from '@/images/icons';
import owl from '@/images/owl.png';
import { getAuthMethod } from '@/lib/utils';

import styles from '@/styles/header.module.scss';

export const Header = () => {
  const { isSignedIn, user } = useUser();
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

  const isDiscordUser = user
    ? getAuthMethod(user.externalAccounts[0].provider) === 'discord'
    : false;

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
              path.value === '/' && isSignedIn ? '/dashboard' : path.value;

            const isRestricted = path.value === '/games' && !isDiscordUser;

            const initialClass =
              path.label === 'Home' ? styles.home : undefined;

            const styleClass =
              pathValue === pathname
                ? `${styles.selected} ${initialClass}`
                : initialClass;

            return (
              (isSignedIn || !path.protected) &&
              !isRestricted && (
                <Link className={styleClass} href={pathValue} key={path.label}>
                  {path.label}
                </Link>
              )
            );
          })}
          {isSignedIn ? (
            <SignOutButton>
              <button className={styles.logButton}>Sign Out</button>
            </SignOutButton>
          ) : (
            <SignInButton>
              <button className={`${styles.logButton} ${styles.login}`}>
                Sign In
              </button>
            </SignInButton>
          )}
        </nav>
      </header>
      <div className={modalClass}>
        <div className={styles.modalContent}>
          <div className={styles.modalLinks}>
            {HEADER_PATHS.map(path => {
              const pathValue =
                path.value === '/' && isSignedIn ? '/dashboard' : path.value;

              const isRestricted = path.value === '/games' && !isDiscordUser;

              return (
                (isSignedIn || !path.protected) &&
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
          {isSignedIn && (
            <SignOutButton>
              <button className={styles.logButton}>Sign Out</button>
            </SignOutButton>
          )}
        </div>
      </div>
    </>
  );
};
