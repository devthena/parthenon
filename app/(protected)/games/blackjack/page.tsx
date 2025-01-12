import { Metadata } from 'next';

import Blackjack from './blackjack';

export const metadata: Metadata = {
  title: 'Parthenon | Blackjack',
};

const BlackjackPage = () => <Blackjack />;
export default BlackjackPage;
