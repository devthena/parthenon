import styles from './page.module.scss';

const FAQ = () => {
  return (
    <div className={styles.faq}>
      <h1>FREQUENTLY ASKED QUESTIONS</h1>
      <div className={styles.questions}>
        <h2>Can I add the bot to my chat / server?</h2>
        <p>
          Sorry, no. The bot is meant to be used privately within the AthenaUS
          community.
        </p>
        <h2>How can I link my Discord and Twitch accounts?</h2>
        <ol>
          <li>Login on this website via Twitch</li>
          <li>Copy the code provided in your profile</li>
          <li>
            Go to the Discord server and use the <code>/link</code> command and
            paste the code
          </li>
          <li>
            After you submit, you will see a confirmation that your accounts are
            linked
          </li>
        </ol>
        <h2>What if I linked the wrong account?</h2>
        <p>
          In the Discord server, use the <code>/unlink</code> command to unlink
          your accounts.
          <br />
          Note: Your coins will stay in your Discord account.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
