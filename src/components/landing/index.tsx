import { Pages } from '../../constants/enums';
import { LandingProps } from '../../constants/types';

import Socials from '../socials';
import styles from './index.module.scss';

const Landing = ({ setPage }: LandingProps) => {
  return (
    <div className={styles.container}>
      <figure>
        <img alt="Athena" className={styles.hero} src="/athena.png" />
      </figure>
      <div className={styles.content}>
        <h1>🌸 AthenaUS 🌸</h1>
        <div>
          <h2>Twitch Affiliate</h2>
          <p>
            Join my community on{' '}
            <a
              href="https://discord.gg/athenaus"
              target="_blank"
              rel="noreferrer">
              Discord
            </a>{' '}
            and{' '}
            <a
              href="https://twitch.tv/athenaus"
              target="_blank"
              rel="noreferrer">
              Twitch
            </a>
          </p>
          <h2>Software Engineer</h2>
          <p>
            Check out what I've worked on:{' '}
            <button onClick={() => setPage(Pages.Projects)}>Projects</button>
          </p>
        </div>
        <div className={styles.socials}>
          <h3>Connect with me:</h3>
          <Socials />
        </div>
      </div>
    </div>
  );
};

export default Landing;
