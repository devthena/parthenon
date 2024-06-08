'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Loading from '../../components/loading';
import { useApi } from '../../hooks';
import { ApiUrls } from '../../lib/constants/db';
import { LoginMethod } from '../../lib/enums/auth';

const Dashboard = () => {
  const { apiError, isFetching, profile, fetchData } = useApi();
  const { user, error, isLoading } = useUser();

  const [isDataFetched, setIsDataFetched] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user || !user.sub) return redirect('/');

  const userSub = user.sub.split('|');
  const userId = userSub[2];
  const loginMethod = userSub[1] as LoginMethod;

  if (!isDataFetched) {
    fetchData(ApiUrls.users, {
      id: userId,
      method: loginMethod,
    });

    setIsDataFetched(true);
  }

  return (
    <div>
      {user && (
        <div>
          {user.picture && (
            <figure>
              <Image alt="Avatar" height={112} src={user.picture} width={112} />
            </figure>
          )}
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      {!profile && isFetching && <Loading />}
      {!profile && !isFetching && (
        <div>
          <p>
            Start earning points by participating in AthenaUS Twitch chat and
            Discord server!
          </p>
        </div>
      )}
      {profile && (
        <div>
          <p>Cash: {profile.cash}</p>
          <p>Bank: {profile.bank}</p>
          <p>Total: {profile.cash + profile.bank}</p>
        </div>
      )}
      {apiError && (
        <div>
          <p>User Data Fetch Error: {apiError}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
