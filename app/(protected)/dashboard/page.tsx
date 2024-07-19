import { Metadata } from 'next';

import Dashboard from './dashboard';

export const metadata: Metadata = {
  title: 'Parthenon | Dashboard',
};

const DashboardPage = () => <Dashboard />;
export default DashboardPage;
