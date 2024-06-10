'use client';

import { redirect } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Header, Loading } from './components';
import styles from './styles/page.module.scss';

const Home = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (user) return redirect('/dashboard');

  return (
    <div>
      <Header isProtected={false} />
      <div className={styles.container}>
        <div className={styles.social}>
          <p>Connect with me!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
