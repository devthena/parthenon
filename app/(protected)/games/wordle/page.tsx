'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Loading } from '../../../components/loading';
import { useStats, useWordle } from '../../../hooks';
import { BackIcon } from '../../../icons';

import { MaxAttempts, WordLength } from '../../../lib/constants/wordle';
import { GameCode } from '../../../lib/enums/games';
import { GameStatus, KeyStatus, WordleStatus } from '../../../lib/enums/wordle';

import { AnswerGrid, Keyboard, Notice, Stats } from './components';

import styles from './page.module.scss';
import { Guess } from '../../../lib/types/wordle';

const Wordle = () => {
  const { user, error, isLoading } = useUser();
  const { stats, statsLoading, statsError, fetchStats } = useStats(
    GameCode.Wordle
  );

  const {
    answer,
    currentGuess,
    guesses,
    status,
    keyResults,
    onDelete,
    onEnter,
    onKey,
    onReset,
    onResume,
  } = useWordle();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Enter') {
        onEnter();
      } else if (key === 'Backspace') {
        onDelete();
      } else if (/^[a-zA-Z]$/.test(key)) {
        onKey(key.toLowerCase());
      }
    },
    [onEnter, onDelete, onKey]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const [isInitialized, setIsInitialized] = useState(false);
  const [page, setPage] = useState(GameStatus.Overview);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;
  if (!user) return redirect('/');

  if (!isInitialized) {
    const userSub = user.sub?.split('|');
    const userId = userSub ? userSub[2] : null;

    if (!userId) return;

    fetchStats(userId);
    setIsInitialized(true);
  }

  const initialGuessResult = Array(WordLength).fill(KeyStatus.Default);
  const isGameover =
    status === WordleStatus.Answered || status === WordleStatus.Completed;

  // + 1 to take into account the current guess
  const fillLength = MaxAttempts - (guesses.length + 1);
  const fillArray: Guess[] =
    fillLength > 0
      ? Array(fillLength).fill({
          word: '',
          result: initialGuessResult,
        })
      : [];

  const currentGuessArray: Guess[] = [
    {
      word: currentGuess,
      result: initialGuessResult,
    },
  ];

  const guessesArray: Guess[] = [
    ...guesses,
    ...currentGuessArray,
    ...fillArray,
  ];

  return (
    <>
      <h1>WORDLE</h1>
      {page === GameStatus.Overview && (
        <div>
          <button
            className={styles.play}
            onClick={() => setPage(GameStatus.Playing)}>
            PLAY
          </button>
          {(!stats || statsLoading) && <Loading />}
          {!statsLoading && stats && <Stats data={stats} />}
          {statsError && <p>Stats Fetch Error: {statsError}</p>}
        </div>
      )}
      {page === GameStatus.Playing && (
        <div>
          <button
            className={styles.back}
            onClick={() => {
              onReset();
              setPage(GameStatus.Overview);
            }}>
            <BackIcon />
          </button>
          <button
            className={styles.backDesktop}
            onClick={() => {
              onReset();
              setPage(GameStatus.Overview);
            }}>
            <BackIcon />
            <span>BACK</span>
          </button>
          <Notice
            answer={answer}
            currentGuess={currentGuess}
            status={status}
            onResume={onResume}
          />
          <AnswerGrid
            currentTurn={guesses.length}
            guesses={guessesArray}
            status={status}
          />
          <Keyboard
            keyResults={keyResults}
            onDelete={onDelete}
            onEnter={onEnter}
            onKey={onKey}
          />
        </div>
      )}
    </>
  );
};

export default Wordle;
