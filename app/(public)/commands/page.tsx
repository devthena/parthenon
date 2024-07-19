import { Metadata } from 'next';

import Commands from './commands';

export const metadata: Metadata = {
  title: 'Parthenon | Commands',
};

const CommandsPage = () => <Commands />;
export default CommandsPage;
