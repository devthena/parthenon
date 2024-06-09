'use client';

import { redirect } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import Loading from './components/loading';

const Home = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (user) return redirect('/dashboard');

  return (
    <div>
      <p>Hello World!</p>
      <a href="/api/auth/login">Login</a>
    </div>
  );
};

export default Home;
