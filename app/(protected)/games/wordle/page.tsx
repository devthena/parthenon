'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useApi, useWordle } from '@/hooks';

import { MAX_ATTEMPTS, WORD_LENGTH, WORD_LIST } from '@/constants/wordle';

import { ApiDataType, ApiUrl } from '@/enums/api';
import { GameCode, GamePage } from '@/enums/games';
import { KeyStatus, WordleStatus } from '@/enums/wordle';

import { Guess } from '@/types/wordle';

import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { encrypt } from '@/utils';

import { AnswerGrid, Keyboard, Modal, Notice, Stats } from './components';
import styles from './page.module.scss';

const Wordle = () => {
  const {
    isFetched,
    isLoading,
    games,
    stats,
    user,
    onSetGame,
    onSetStats,
    onSetUser,
  } = useParthenonState();

  const {
    dataGame,
    dataStats,
    isFetched: isApiFetched,
    fetchPostData,
  } = useApi();

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
    onPlay,
    onReset,
    onResume,
  } = useWordle();

  const [isStatsUpdated, setIsStatsUpdated] = useState(false);
  const [page, setPage] = useState(GamePage.Overview);

  const answerRef = useRef(answer);
  const currentGuessRef = useRef(currentGuess);
  const gameKeyRef = useRef(games[GameCode.Wordle]);
  const gameStatusRef = useRef(status);

  const getStats = useCallback(async () => {
    await fetchPostData(ApiUrl.Stats, ApiDataType.Stats, {
      code: GameCode.Wordle,
    });
  }, [fetchPostData]);

  const getGame = useCallback(async () => {
    await fetchPostData(ApiUrl.Games, ApiDataType.Games, {
      code: GameCode.Wordle,
      data: {
        sessionKey: encrypt(answerRef.current),
      },
    });
  }, [fetchPostData]);

  const updateGame = async (guess: string) => {
    if (!gameKeyRef.current) return;

    await fetchPostData(
      ApiUrl.Games,
      ApiDataType.Games,
      {
        code: GameCode.Wordle,
        key: gameKeyRef.current,
        data: {
          sessionCode: encrypt(guess),
        },
      },
      true
    );
  };

  const modifiedEnter = async () => {
    if (gameStatusRef.current === WordleStatus.Standby) return;

    if (
      gameStatusRef.current === WordleStatus.Answered ||
      gameStatusRef.current === WordleStatus.Completed
    ) {
      onPlay();
      return;
    }

    onEnter();

    if (currentGuessRef.current.length < WORD_LENGTH) return;
    if (!WORD_LIST.includes(currentGuessRef.current)) return;

    updateGame(currentGuessRef.current);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;
    if (key === 'Enter') {
      modifiedEnter();
    } else if (key === 'Backspace') {
      onDelete();
    } else if (/^[a-zA-Z]$/.test(key)) {
      onKey(key.toLowerCase());
    }
  };

  useEffect(() => {
    if (!stats[GameCode.Wordle]) getStats();

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (answer.length === 0) return;
    answerRef.current = answer;
    getGame();
  }, [answer, getGame]);

  useEffect(() => {
    currentGuessRef.current = currentGuess;
  }, [currentGuess]);

  useEffect(() => {
    gameKeyRef.current = games[GameCode.Wordle];
  }, [games]);

  useEffect(() => {
    gameStatusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!isApiFetched || !dataGame) return;
    onSetGame(dataGame);
  }, [dataGame, isApiFetched, onSetGame]);

  useEffect(() => {
    if (!isApiFetched || !dataStats || stats[GameCode.Wordle]) return;
    onSetStats(dataStats);
  }, [dataStats, isApiFetched, stats, onSetStats]);

  useEffect(() => {
    if (
      !user ||
      !user.discord_username ||
      !stats[GameCode.Wordle] ||
      isStatsUpdated
    )
      return;

    if (status === WordleStatus.Answered) {
      setIsStatsUpdated(true);

      const newDistribution = [...stats[GameCode.Wordle].distribution];
      newDistribution[guesses.length - 1] += 1;

      onSetStats({
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

      if (reward) {
        onSetUser({
          ...user,
          cash: user.cash + reward,
        });
      }
    } else if (status === WordleStatus.Completed) {
      setIsStatsUpdated(true);

      onSetStats({
        [GameCode.Wordle]: {
          ...stats[GameCode.Wordle],
          currentStreak: 0,
          totalPlayed: stats[GameCode.Wordle].totalPlayed + 1,
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
    onSetStats,
    onSetUser,
  ]);

  useEffect(() => {
    if (status === WordleStatus.Playing && isStatsUpdated) {
      setIsStatsUpdated(false);
    }
  }, [status, isStatsUpdated]);

  if (isFetched && (!user || !user?.discord_username)) redirect('/dashboard');

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
          {page !== GamePage.Overview && (
            <>
              <button
                className={styles.back}
                onClick={() => {
                  onReset();
                  setPage(GamePage.Overview);
                }}>
                <BackIcon />
              </button>
              <button
                className={styles.backDesktop}
                onClick={() => {
                  onReset();
                  setPage(GamePage.Overview);
                }}>
                <BackIcon />
                <span>QUIT</span>
              </button>
            </>
          )}
        </div>
        <h1>WORDLE</h1>
        <div className={styles.rightButtons}>
          {page === GamePage.Overview && (
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
          {page !== GamePage.Overview && (
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
      {page === GamePage.Overview && (
        <div className={styles.overview}>
          <button
            className={styles.play}
            onClick={() => {
              onPlay();
              setPage(GamePage.Playing);
            }}>
            PLAY
          </button>
          <div className={styles.statsContainer}>
            {(isLoading || !stats[GameCode.Wordle]) && <Loading />}
            {!isLoading && stats[GameCode.Wordle] && (
              <Stats data={stats[GameCode.Wordle]} />
            )}
          </div>
        </div>
      )}
      {page === GamePage.Playing && (
        <div className={styles.playing}>
          {(isLoading || !games[GameCode.Wordle]) && <Loading />}
          {!isLoading && games[GameCode.Wordle] && (
            <>
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
                onEnter={modifiedEnter}
                onKey={onKey}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Wordle;
