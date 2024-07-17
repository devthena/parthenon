'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useApi, useWordle } from '@/hooks';

import { INITIAL_WORDLE } from '@/constants/stats';
import { MAX_ATTEMPTS, WORD_LENGTH, WORD_LIST } from '@/constants/wordle';

import { ApiDataType, ApiUrl } from '@/enums/api';
import { GameCode, GamePage } from '@/enums/games';
import { KeyStatus, WordleStatus } from '@/enums/wordle';

import { GameStateObject } from '@/types/games';
import { Guess, WordleObject } from '@/types/wordle';

import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { encrypt } from '@/utils';

import { AnswerGrid, Keyboard, Modal, Notice, Stats } from './components';
import styles from './page.module.scss';

const Wordle = () => {
  const {
    isLoading,
    games,
    stats,
    user,
    onSetGame,
    onSetStats,
    onSetUser,
    saveStats,
  } = useParthenonState();

  if (!user?.discord_username) redirect('/dashboard');

  const {
    data,
    isLoading: isApiLoading,
    isProcessed,
    fetchData,
    fetchGameData,
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
  const [isStatsSaved, setIsStatsSaved] = useState(false);
  const [page, setPage] = useState(GamePage.Overview);

  const answerRef = useRef(answer);
  const currentGuessRef = useRef(currentGuess);
  const gameKeyRef = useRef(games[GameCode.Wordle]);
  const gameStatusRef = useRef(status);

  const getGame = useCallback(async () => {
    await fetchGameData(
      ApiUrl.Games,
      ApiDataType.Games,
      {
        code: GameCode.Wordle,
        data: {
          sessionKey: encrypt(answerRef.current),
        },
      },
      true
    );
  }, [fetchGameData]);

  const updateGame = async (guess: string) => {
    await fetchGameData(ApiUrl.Games, ApiDataType.Games, {
      code: GameCode.Wordle,
      key: gameKeyRef.current,
      data: {
        sessionCode: encrypt(guess),
      },
    });
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
    window.addEventListener('keydown', handleKeyPress);

    if (!stats[GameCode.Wordle]) {
      const getStats = async () => {
        await fetchData(
          `${ApiUrl.Stats}/${GameCode.Wordle}`,
          ApiDataType.Stats
        );
      };

      getStats();
    }
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
    if (!isProcessed || !data) return;

    switch (data.type) {
      case ApiDataType.Games:
        if (data.data) {
          onSetGame(data.data as GameStateObject);
        }
        break;
      case ApiDataType.Stats:
        if (data.data) {
          onSetStats({ [GameCode.Wordle]: data.data as WordleObject });
        } else {
          onSetStats({ [GameCode.Wordle]: INITIAL_WORDLE });
        }
        break;
    }
  }, [data, isProcessed, onSetGame, onSetStats]);

  useEffect(() => {
    if (!user.discord_username || !stats[GameCode.Wordle] || isStatsUpdated)
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

      if (user && reward) {
        onSetUser({
          ...user,
          cash: user.cash + reward,
        });
      }
    } else if (status === WordleStatus.Completed) {
      setIsStatsUpdated(true);

      onSetStats({
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
    onSetStats,
    onSetUser,
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

    saveStats(GameCode.Wordle);

    setIsStatsSaved(true);
  }, [user, isStatsSaved, isStatsUpdated, reward, status, saveStats]);

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
            {(!stats[GameCode.Wordle] || isLoading || isApiLoading) && (
              <Loading />
            )}
            {stats[GameCode.Wordle] && !isLoading && !isApiLoading && (
              <Stats data={stats[GameCode.Wordle]} />
            )}
          </div>
        </div>
      )}
      {page === GamePage.Playing && (
        <div className={styles.playing}>
          {(isApiLoading || !games[GameCode.Wordle]) && <Loading />}
          {!isApiLoading && games[GameCode.Wordle] && (
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
