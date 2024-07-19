import { Metadata } from 'next';

import Games from './games';

export const metadata: Metadata = {
  title: 'Parthenon | Games',
};

const GamesPage = () => <Games />;
export default GamesPage;
