'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Loading from '../../../components/loading';
import { useApi, useStats, useWordle } from '../../../hooks';

import { ApiUrls } from '../../../lib/constants/db';
import { LoginMethod } from '../../../lib/enums/auth';
import { GameStatus, WordleStatus } from '../../../lib/enums/wordle';

import { AnswerGrid, Keyboard, Notice, Stats } from './components';

import styles from './styles.module.scss';

const Wordle = () => {
  const { apiError, stats, fetchData } = useApi();
  const { wordleStats, setWordleStats, updateWordleStats } = useStats();
  const { user, error, isLoading } = useUser();

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [status, setStatus] = useState(GameStatus.Overview);

  const {
    guessColors,
    guesses,
    handleKeyUp,
    keyColors,
    keyIds,
    turn,
    word,
    wordleStatus,
  } = useWordle(null);

  useEffect(() => {
    if (isDataFetched && stats) setWordleStats(stats.wordle);
  }, [isDataFetched, stats, setWordleStats]);

  useEffect(() => {
    if (
      !isGameOver &&
      (wordleStatus === WordleStatus.Answered ||
        wordleStatus === WordleStatus.Completed)
    ) {
      setIsGameOver(true);
      updateWordleStats(turn);
    } else if (isGameOver && wordleStatus === WordleStatus.Restart) {
      setIsGameOver(false);
    }
  }, [isGameOver, turn, updateWordleStats, wordleStatus]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user || !user.sub) return redirect('/');

  const userSub = user.sub.split('|');
  const userId = userSub[2];
  const loginMethod = userSub[1] as LoginMethod;

  if (!isDataFetched) {
    const keyUpHandler = (evt: KeyboardEvent) => {
      handleKeyUp(evt.key);
    };

    window.addEventListener('keyup', keyUpHandler, true);

    fetchData(ApiUrls.stats, userId, loginMethod);
    setIsDataFetched(true);
  }

  return (
    <div>
      <h1>Wordle</h1>
      {status === GameStatus.Overview && (
        <div>
          <button
            className={styles.play}
            onClick={() => setStatus(GameStatus.Start)}>
            PLAY
          </button>
          <Stats data={wordleStats} />
        </div>
      )}
      {status === GameStatus.Start && (
        <div>
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
      {apiError && (
        <div>
          <p>User Stats Fetch Error: {apiError}</p>
        </div>
      )}
    </div>
  );
};

export default Wordle;
