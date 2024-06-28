import styles from '../styles/instructions.module.scss';

export const Instructions = ({ code }: { code?: string }) => {
  return (
    <div className={styles.instructions}>
      {code ? (
        <>
          <h2>Link your Discord account!</h2>
          <p className={styles.copyText}>Copy the code below:</p>
          <code className={styles.userCode}>{code}</code>
          <div className={styles.steps}>
            <p>
              In the Discord server, use the <code>/link</code> command and
              enter the code.
            </p>
            <p className={styles.note}>
              Note: Should you need to unlink your accounts, use{' '}
              <code>/unlink</code> in the server.
            </p>
          </div>
        </>
      ) : (
        <>
          <h2>Link your Twitch account!</h2>
          <div className={styles.steps}>
            <p>Login on this website via Twitch.</p>
            <p>
              You will be provided a code to submit using <code>/link</code> in
              the server.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
