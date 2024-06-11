import { DiscordIcon, TwitchIcon } from '../../../icons';
import { SocialUrls } from '../../../lib/constants';
import styles from '../styles/register.module.scss';

export const Register = () => {
  return (
    <div className={styles.register}>
      <h2>Join our Community</h2>
      <h3>to start earning points</h3>
      <div className={styles.buttons}>
        <a className={styles.button} href={SocialUrls.Twitch} target="_blank">
          <TwitchIcon />
          <span>AthenaUS</span>
        </a>
        <a className={styles.button} href={SocialUrls.Discord} target="_blank">
          <DiscordIcon />
          <span>AthenaUS</span>
        </a>
      </div>
    </div>
  );
};
