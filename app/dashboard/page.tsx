"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import Loading from "../components/loading";
import { useApi } from "../hooks";
import { LoginMethod } from "../lib/enums";

const Dashboard = () => {
  const { data, apiError, fetchUser } = useApi();
  const { user, error, isLoading } = useUser();

  const [isDataFetched, setIsDataFetched] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user || !user.sub) return redirect("/");

  const userSub = user.sub.split("|");
  const userId = userSub[2];
  const loginMethod = userSub[1] as LoginMethod;

  if (!isDataFetched) {
    fetchUser(userId, loginMethod);
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
      {data && (
        <div>
          <p>Cash: {data.cash}</p>
          <p>Bank: {data.bank}</p>
          <p>Total: {data.cash + data.bank}</p>
        </div>
      )}
      {apiError && (
        <div>
          <p>Fetch Error: {apiError}</p>
        </div>
      )}
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
};

export default Dashboard;
