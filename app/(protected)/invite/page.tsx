import { Metadata } from 'next';

import Invite from './invite';

export const metadata: Metadata = {
  title: 'Parthenon | Invite',
};

const InvitePage = () => <Invite />;
export default InvitePage;
