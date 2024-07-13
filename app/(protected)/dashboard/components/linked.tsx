import Link from 'next/link';
import { DiscordIcon, TwitchIcon } from '@/images/icons';

import styles from '../styles/linked.module.scss';

export const AccountLinked = ({
  discord,
  twitch,
}: {
  discord: string;
  twitch: string;
}) => {
  return (
    <div className={styles.linked}>
      <h2>Accounts Linked</h2>
      <div className={styles.buttons}>
        <a
          className={styles.button}
          href={`https://twitch.tv/${twitch}`}
          target="_blank">
          <TwitchIcon />
          <span>{twitch}</span>
        </a>
        <div className={styles.button}>
          <DiscordIcon />
          <span>{discord}</span>
        </div>
      </div>
      <Link className={styles.note} href="/faq">
        Want to unlink your accounts?
      </Link>
    </div>
  );
};
