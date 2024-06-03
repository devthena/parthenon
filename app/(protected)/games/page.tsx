import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import Loading from '../../components/loading';

const Games = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user) return redirect('/');

  return (
    <div>
      <h1>Games</h1>
      <Link href="/games/wordle">Wordle</Link>
    </div>
  );
};

export default Games;
