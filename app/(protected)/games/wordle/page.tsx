'use client';

import { useCallback, useEffect, useState } from 'react';

import { useParthenonState } from '../../../context';

import { Loading } from '../../../components/loading';
import { useStats, useWordle } from '../../../hooks';
import { BackIcon } from '../../../icons';

import { MaxAttempts, WordLength } from '../../../lib/constants/wordle';
import { GameCode } from '../../../lib/enums/games';
import { GameStatus, KeyStatus, WordleStatus } from '../../../lib/enums/wordle';
import { Guess } from '../../../lib/types/wordle';

import { AnswerGrid, Keyboard, Notice, Stats } from './components';

import styles from './page.module.scss';

const Wordle = () => {
  const { user, onUpdateUser, saveUser } = useParthenonState();

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
    keyResults,
    reward,
    status,
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

      if (user && reward) {
        onUpdateUser({
          ...user,
          cash: user.cash + reward,
        });
      }
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
  }, [
    guesses.length,
    isStatsUpdated,
    reward,
    stats,
    status,
    user,
    onUpdateUser,
    updateStats,
  ]);

  useEffect(() => {
    if (status === WordleStatus.Playing && isStatsSaved && isStatsUpdated) {
      setIsStatsUpdated(false);
      setIsStatsSaved(false);
    }
  }, [status, isStatsSaved, isStatsUpdated]);

  useEffect(() => {
    if (!user || !user.user_id || !isStatsUpdated || isStatsSaved) return;

    if (status !== WordleStatus.Answered && status !== WordleStatus.Completed) {
      return;
    }

    saveStats(user.user_id);
    setIsStatsSaved(true);

    // user is updated only when the Wordle is answered
    if (status === WordleStatus.Answered) saveUser();
  }, [user, isStatsSaved, isStatsUpdated, status, saveStats, saveUser]);

  if (!isInitialized) {
    if (!user) return;
    fetchStats(user.user_id);
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
      <div className={styles.wordle}>
        <h1 className={styles.title}>WORDLE</h1>
        {page === GameStatus.Overview && (
          <div className={styles.overview}>
            <button
              className={styles.play}
              onClick={() => setPage(GameStatus.Playing)}>
              PLAY
            </button>
            <div className={styles.statsContainer}>
              {(!stats || statsFetchLoading) && <Loading />}
              {!statsFetchLoading && stats && <Stats data={stats} />}
              {statsError && <p>Stats Fetch Error: {statsError}</p>}
            </div>
          </div>
        )}
        {page === GameStatus.Playing && (
          <div className={styles.playing}>
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
              <span>QUIT</span>
            </button>
            <Notice
              answer={answer}
              currentGuess={currentGuess}
              status={status}
              reward={reward}
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
      </div>
      {statsError && <p>User Stats Error: {statsError}</p>}
    </>
  );
};

export default Wordle;
