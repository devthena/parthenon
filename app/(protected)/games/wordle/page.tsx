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

  const {
    stats,
    statsFetchLoading,
    statsError,
    fetchStats,
    saveStats,
    updateStats,
  } = useStats(GameCode.Wordle);

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

  const [isInitialized, setIsInitialized] = useState(false);
  const [isStatsUpdated, setIsStatsUpdated] = useState(false);
  const [isStatsSaved, setIsStatsSaved] = useState(false);
  const [page, setPage] = useState(GameStatus.Overview);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!stats || isStatsUpdated) return;

    if (status === WordleStatus.Answered) {
      setIsStatsUpdated(true);

      const newDistribution = [...stats.distribution];
      newDistribution[guesses.length - 1] += 1;

      updateStats({
        currentStreak: stats.currentStreak + 1,
        distribution: newDistribution,
        maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
        totalPlayed: stats.totalPlayed + 1,
        totalWon: stats.totalWon + 1,
      });
    } else if (status === WordleStatus.Completed) {
      setIsStatsUpdated(true);

      updateStats({
        currentStreak: 0,
        distribution: [...stats.distribution],
        maxStreak: stats.maxStreak,
        totalPlayed: stats.totalPlayed + 1,
        totalWon: stats.totalWon,
      });
    }
  }, [guesses.length, isStatsUpdated, stats, status, updateStats]);

  useEffect(() => {
    if (status === WordleStatus.Playing && isStatsSaved && isStatsUpdated) {
      setIsStatsUpdated(false);
      setIsStatsSaved(false);
    }
  }, [status, isStatsSaved, isStatsUpdated]);

  const userSub = user?.sub?.split('|');
  const userId = userSub ? userSub[2] : null;

  useEffect(() => {
    if (!userId || !isStatsUpdated || isStatsSaved) return;
    saveStats(userId);
    setIsStatsSaved(true);
  }, [userId, isStatsSaved, isStatsUpdated, saveStats]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;
  if (!user) return redirect('/');

  if (!isInitialized) {
    if (!userId) return;
    fetchStats(userId);
    setIsInitialized(true);
  }

  const initialGuessResult = Array(WordLength).fill(KeyStatus.Default);

  // + 1 to take into account the current guess
  const fillLength = MaxAttempts - (guesses.length + 1);
  const fillArray: Guess[] =
    fillLength > 0
      ? Array(fillLength).fill({
          word: '',
          result: initialGuessResult,
        })
      : [];

  const currentGuessArray: Guess[] =
    guesses.length < MaxAttempts
      ? [
          {
            word: currentGuess,
            result: initialGuessResult,
          },
        ]
      : [];

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
          {(!stats || statsFetchLoading) && <Loading />}
          {!statsFetchLoading && stats && <Stats data={stats} />}
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
