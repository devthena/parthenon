import Link from 'next/link';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <header>
        <nav>
          <Link href="/dashboard">Home</Link>
          <Link href="/games">Games</Link>
        </nav>
        <a href="/api/auth/logout">Logout</a>
      </header>
      {children}
    </div>
  );
};

export default ProtectedLayout;
