'use client';

import Image from 'next/image';
import { useParthenonState } from '@/context';

import styles from './page.module.scss';

const whitelist = process.env.NEXT_PUBLIC_DISCORD_TEAM_IDS?.split(',') ?? [];
const inviteURL = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? '';

const Invite = () => {
  const { user } = useParthenonState();

  const isRestricted = !user || !whitelist.includes(user.discord_id ?? '');

  return (
    <div className={styles.invite}>
      <h1>INVITE LITTLE OWL</h1>
      <figure className={styles.avatar}>
        <Image
          alt="Little Owl"
          height={72}
          priority
          src="/owl.png"
          width={72}
        />
      </figure>
      {isRestricted && (
        <div>
          <p>Only specific users can invite Little Owl.</p>
          <p>
            If you are a member of the Little Owl Team, contact{' '}
            <a href="mailto:athena@parthenon.app">athena@parthenon.app</a> for
            access.
          </p>
        </div>
      )}
      {!isRestricted && (
        <a className={styles.inviteButton} href={inviteURL}>
          ADD TO SERVER
        </a>
      )}
    </div>
  );
};

export default Invite;
