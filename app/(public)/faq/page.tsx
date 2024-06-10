'use client';

import styles from './page.module.scss';

const FAQ = () => {
  return (
    <div className={styles.faq}>
      <h1 className={styles.title}>FREQUENTLY ASKED QUESTIONS</h1>
      <div className={styles.questions}>
        <h2>Can I add the bot to my Twitch channel / Discord server?</h2>
        <p>
          Sorry, no. The bot is meant to be used privately within the AthenaUS
          community.
        </p>
        <h2>
          I have coins on both Twitch and Discord account. How can I link them?
        </h2>
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
        <h2>
          I made a mistake and linked the wrong account. How do I undo this?
        </h2>
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
