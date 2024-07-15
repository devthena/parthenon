'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useWordle } from '@/hooks';

import { MAX_ATTEMPTS, WORD_LENGTH } from '@/constants/wordle';
import { GameCode, GameStatus } from '@/enums/games';
import { KeyStatus, WordleStatus } from '@/enums/wordle';
import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { Guess } from '@/types/wordle';

import { AnswerGrid, Keyboard, Modal, Notice, Stats } from './components';
import styles from './page.module.scss';

const Wordle = () => {
  const {
    isLoading,
    stats,
    user,
    onUpdateStats,
    onUpdateUser,
    saveStats,
    saveUser,
  } = useParthenonState();

  if (!user?.discord_username) redirect('/dashboard');

  const {
    answer,
    currentGuess,
    guesses,
    keyResults,
    modalContent,
    modalDisplay,
    reward,
    status,
    onDelete,
    onEnter,
    onKey,
    onModalClose,
    onModalRules,
    onModalStats,
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

  const [isStatsUpdated, setIsStatsUpdated] = useState(false);
  const [isStatsSaved, setIsStatsSaved] = useState(false);
  const [page, setPage] = useState(GameStatus.Overview);

  useEffect(() => {
    // generate a new answer for wordle
    onReset();

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!user.discord_username || !stats[GameCode.Wordle] || isStatsUpdated)
      return;

    if (status === WordleStatus.Answered) {
      setIsStatsUpdated(true);

      const newDistribution = [...stats[GameCode.Wordle].distribution];
      newDistribution[guesses.length - 1] += 1;

      onUpdateStats({
        ...stats,
        // @todo: Update API calls  for stats
        // discord_id: user.discord_id,
        [GameCode.Wordle]: {
          currentStreak: stats[GameCode.Wordle].currentStreak + 1,
          distribution: newDistribution,
          maxStreak: Math.max(
            stats[GameCode.Wordle].maxStreak,
            stats[GameCode.Wordle].currentStreak + 1
          ),
          totalPlayed: stats[GameCode.Wordle].totalPlayed + 1,
          totalWon: stats[GameCode.Wordle].totalWon + 1,
        },
      });

      if (user && reward) {
        onUpdateUser({
          ...user,
          cash: user.cash + reward,
        });
      }
    } else if (status === WordleStatus.Completed) {
      setIsStatsUpdated(true);

      onUpdateStats({
        ...stats,
        // @todo: Update API calls  for stats
        // discord_id: user.discord_id,
        [GameCode.Wordle]: {
          currentStreak: 0,
          distribution: [...stats[GameCode.Wordle].distribution],
          maxStreak: stats[GameCode.Wordle].maxStreak,
          totalPlayed: stats[GameCode.Wordle].totalPlayed + 1,
          totalWon: stats[GameCode.Wordle].totalWon,
        },
      });
    }
  }, [
    guesses.length,
    isStatsUpdated,
    reward,
    stats,
    status,
    user,
    onUpdateStats,
    onUpdateUser,
  ]);

  useEffect(() => {
    if (status === WordleStatus.Playing && isStatsSaved && isStatsUpdated) {
      setIsStatsUpdated(false);
      setIsStatsSaved(false);
    }
  }, [status, isStatsSaved, isStatsUpdated]);

  useEffect(() => {
    if (!user || !user.discord_username || !isStatsUpdated || isStatsSaved)
      return;

    if (status !== WordleStatus.Answered && status !== WordleStatus.Completed) {
      return;
    }

    saveStats();
    setIsStatsSaved(true);

    // user is updated only when the Wordle is answered
    if (status === WordleStatus.Answered) saveUser();
  }, [user, isStatsSaved, isStatsUpdated, status, saveStats, saveUser]);

  const initialGuessResult = Array(WORD_LENGTH).fill(KeyStatus.Default);

  // + 1 to take into account the current guess
  const fillLength = MAX_ATTEMPTS - (guesses.length + 1);

  const fillArray: Guess[] =
    fillLength > 0
      ? Array(fillLength).fill({
          word: '',
          result: initialGuessResult,
        })
      : [];

  const currentGuessArray: Guess[] =
    guesses.length < MAX_ATTEMPTS
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
    <div className={styles.wordle}>
      {modalDisplay && (
        <Modal
          content={modalContent}
          stats={stats[GameCode.Wordle]}
          onModalClose={onModalClose}
        />
      )}
      <div className={styles.header}>
        <div className={styles.leftButtons}>
          {page !== GameStatus.Overview && (
            <>
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
            </>
          )}
        </div>
        <h1>WORDLE</h1>
        <div className={styles.rightButtons}>
          {page === GameStatus.Overview && (
            <>
              <button
                className={styles.rulesOverview}
                onClick={() => onModalRules()}>
                <RulesIcon />
              </button>
              <button
                className={styles.rulesDesktop}
                onClick={() => onModalRules()}>
                RULES
              </button>
            </>
          )}
          {page !== GameStatus.Overview && (
            <>
              <button className={styles.rules} onClick={() => onModalRules()}>
                <RulesIcon />
              </button>
              <button className={styles.stats} onClick={() => onModalStats()}>
                <StatsIcon />
              </button>
            </>
          )}
        </div>
      </div>
      {page === GameStatus.Overview && (
        <div className={styles.overview}>
          <button
            className={styles.play}
            onClick={() => setPage(GameStatus.Playing)}>
            PLAY
          </button>
          <div className={styles.statsContainer}>
            {(!stats || isLoading) && <Loading />}
            {!isLoading && stats && <Stats data={stats[GameCode.Wordle]} />}
          </div>
        </div>
      )}
      {page === GameStatus.Playing && (
        <div className={styles.playing}>
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
  );
};

export default Wordle;
