'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { Header, Loading, Login } from '@/components';
import { SOCIAL_URLS } from '@/constants/navigation';

import avatar from '@/images/avatar.png';
import { GithubIcon, InstagramIcon, TwitchIcon, XIcon } from '@/images/icons';

import styles from '@/styles/page.module.scss';

const Home = () => {
  const { user, error, isLoading } = useUser();

  if (error) return <div>{error.message}</div>;
  if (user) return redirect('/dashboard');

  return (
    <>
      <Header />
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
          <figure className={styles.avatar}>
            <Image
              alt="Athena Avatar"
              className={styles.avatarImg}
              height={300}
              priority
              src={avatar}
              width={300}
            />
          </figure>
          <div className={styles.description}>
            <h1>Welcome to the Parthenon!</h1>
            <p>The official website of the AthenaUS community</p>
          </div>
          <div className={styles.login}>
            <Login />
          </div>
          <div className={styles.social}>
            <p>Connect with me!</p>
            <div className={styles.socialIcons}>
              <a href={SOCIAL_URLS.Twitch} target="_blank">
                <TwitchIcon />
              </a>
              <a href={SOCIAL_URLS.X} target="_blank">
                <XIcon />
              </a>
              <a href={SOCIAL_URLS.Github} target="_blank">
                <GithubIcon />
              </a>
              <a href={SOCIAL_URLS.Instagram} target="_blank">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
