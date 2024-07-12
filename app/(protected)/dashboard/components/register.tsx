import { DiscordIcon, TwitchIcon } from '../../../images/icons';
import { SOCIAL_URLS } from '../../../lib/constants/navigation';
import styles from '../styles/register.module.scss';

export const Register = () => {
  return (
    <div className={styles.register}>
      <h2>Join our Community</h2>
      <h3>to start earning points</h3>
      <div className={styles.buttons}>
        <a className={styles.button} href={SOCIAL_URLS.Twitch} target="_blank">
          <TwitchIcon />
          <span>AthenaUS</span>
        </a>
        <a className={styles.button} href={SOCIAL_URLS.Discord} target="_blank">
          <DiscordIcon />
          <span>AthenaUS</span>
        </a>
      </div>
    </div>
  );
};
