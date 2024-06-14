'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Loading } from '../../../components/loading';
import { useStats, useWordle } from '../../../hooks';
import { BackIcon } from '../../../icons';
import { GameStatus, WordleStatus } from '../../../lib/enums/wordle';

import { AnswerGrid, Keyboard, Notice, Stats } from './components';

import styles from './page.module.scss';
import { GameCode } from '../../../lib/enums/games';

const Wordle = () => {
  const { user, error, isLoading } = useUser();
  const { stats, statsLoading, statsError, fetchStats } = useStats(
    GameCode.Wordle
  );

  const [isInitialized, setIsInitialized] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [status, setStatus] = useState(GameStatus.Overview);

  const {
    guessColors,
    guesses,
    handleKeyUp,
    keyColors,
    keyIds,
    setWordleStatus,
    turn,
    word,
    wordleStatus,
  } = useWordle(null);

  useEffect(() => {
    if (!isGameOver && (WordleStatus.Answered || WordleStatus.Completed)) {
      setIsGameOver(true);
    } else {
      if (wordleStatus === WordleStatus.Restart) setIsGameOver(false);
    }
  }, [isGameOver, turn, wordleStatus]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;
  if (!user) return redirect('/');

  if (!isInitialized) {
    const keyUpHandler = (evt: KeyboardEvent) => {
      handleKeyUp(evt.key);
    };
    window.addEventListener('keyup', keyUpHandler, true);

    const userSub = user.sub?.split('|');
    const userId = userSub ? userSub[2] : null;

    if (!userId) return;

    fetchStats(userId);
    setIsInitialized(true);
  }

  return (
    <>
      <h1>WORDLE</h1>
      {status === GameStatus.Overview && (
        <div>
          <button
            className={styles.play}
            onClick={() => setStatus(GameStatus.Start)}>
            PLAY
          </button>
          {!stats && <Loading />}
          {statsLoading && stats && <Stats data={stats} />}
          {statsError && <p>Stats Fetch Error: {statsError}</p>}
        </div>
      )}
      {status === GameStatus.Start && (
        <div>
          <button
            className={styles.back}
            onClick={() => {
              setWordleStatus(WordleStatus.Restart);
              setStatus(GameStatus.Overview);
            }}>
            <BackIcon />
          </button>
          <button
            className={styles.backDesktop}
            onClick={() => {
              setWordleStatus(WordleStatus.Restart);
              setStatus(GameStatus.Overview);
            }}>
            <BackIcon />
            <span>BACK</span>
          </button>
          <Notice word={word} status={wordleStatus} />
          <AnswerGrid
            colors={guessColors}
            guesses={guesses}
            status={wordleStatus}
            turn={turn}
          />
          <Keyboard colors={keyColors} keys={keyIds} onKeyUp={handleKeyUp} />
        </div>
      )}
    </>
  );
};

export default Wordle;
