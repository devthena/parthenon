import { DiscordIcon, TwitchIcon } from '../../icons';
import { CommandsDiscord, CommandsTwitch } from '../../lib/constants';
import styles from './page.module.scss';

const Commands = () => {
  return (
    <div className={styles.commands}>
      <h1 className={styles.title}>COMMANDS</h1>
      <div className={styles.boxes}>
        <div className={styles.box}>
          <h2>
            <span>TWITCH</span>
            <TwitchIcon />
          </h2>
          <ul className={styles.list}>
            {CommandsTwitch.map((command, i) => (
              <li key={i}>
                <h3>
                  {command.name}
                  {command.sub && <span>{command.sub}</span>}
                </h3>
                <p>{command.description}</p>
                {command.note && <p className={styles.note}>{command.note}</p>}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.box}>
          <h2>
            <span>DISCORD</span>
            <DiscordIcon />
          </h2>
          <ul className={styles.list}>
            {CommandsDiscord.map((command, i) => (
              <li key={i}>
                <h3>
                  {command.name}
                  {command.sub && <span>{command.sub}</span>}
                </h3>
                <p>{command.description}</p>
                {command.note && <p className={styles.note}>{command.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Commands;
