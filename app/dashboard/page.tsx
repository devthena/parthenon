"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import Loading from "../components/loading";

const Dashboard = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user) return redirect("/");

  return (
    <div>
      <p>Hello User!</p>
      {user && (
        <div>
          <figure>
            <Image
              alt="Avatar"
              height={112}
              src={user.picture ?? ""}
              width={112}
            />
          </figure>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      )}
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
};

export default Dashboard;
