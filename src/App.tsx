import styles from './app.module.scss';
import { Footer, Socials } from './components';

const App = () => {
  return (
    <main className={styles.app}>
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
                href="https://discord.gg/5dzECDz"
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
              Check out what I've worked on: <button>Projects</button>
            </p>
          </div>
          <div className={styles.socials}>
            <h3>Connect with me:</h3>
            <Socials />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default App;
