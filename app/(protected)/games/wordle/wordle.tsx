'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useApi, useWordle } from '@/hooks';

import { MAX_ATTEMPTS, WORD_LENGTH, WORD_LIST } from '@/constants/wordle';

import { ApiDataError, ApiDataType, ApiUrl } from '@/enums/api';
import { GameCode, GamePage, GameRequestType } from '@/enums/games';
import { WordleKeyStatus, WordleStatus } from '@/enums/games';

import { WordleGuess } from '@/interfaces/games';
import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { encrypt } from '@/lib/utils';

import { AnswerGrid, Keyboard, Notice, Rules, Stats } from './components';
import styles from '../shared/styles/page.module.scss';

const Wordle = () => {
  const {
    isFetched,
    isLoading,
    games,
    stats,
    user,
    onSetModal,
    onSetGame,
    onSetStats,
    onSetUser,
  } = useParthenonState();

  const {
    dataGame,
    dataStats,
    error,
    isFetched: isApiFetched,
    clearError,
    fetchPostData,
  } = useApi();

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
      type: GameRequestType.Create,
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
        key: gameKeyRef.current,
        code: GameCode.Wordle,
        type: GameRequestType.Update,
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
    event.preventDefault();

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
    if (answer.length === 0 || answer === answerRef.current) return;
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
    if (!isApiFetched || !error) return;

    // @todo: Create a separate component for errors
    if (error === ApiDataError.HoneyCake) {
      onSetModal({
        isOpen: true,
        content: (
          <div>
            <h3>Rewards Not Added</h3>
            <p>
              Earning coins has been halted until Cerberus has returned. You can
              revive him with Honey Cake or wait for his natural resurrection.
              Check the Discord server for more details.
            </p>
          </div>
        ),
      });

      clearError();
    }
  }, [error, isApiFetched, clearError, onSetModal]);

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

  const initialGuessResult = Array(WORD_LENGTH).fill(WordleKeyStatus.Default);

  // + 1 to take into account the current guess
  const fillLength = MAX_ATTEMPTS - (guesses.length + 1);

  const fillArray: WordleGuess[] =
    fillLength > 0
      ? Array(fillLength).fill({
          word: '',
          result: initialGuessResult,
        })
      : [];

  const currentGuessArray: WordleGuess[] =
    guesses.length < MAX_ATTEMPTS
      ? [
          {
            word: currentGuess,
            result: initialGuessResult,
          },
        ]
      : [];

  const guessesArray: WordleGuess[] = [
    ...guesses,
    ...currentGuessArray,
    ...fillArray,
  ];

  return (
    <div className={styles.wordle}>
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
                onClick={() =>
                  onSetModal({
                    isOpen: true,
                    content: <Rules />,
                  })
                }>
                <RulesIcon />
              </button>
              <button
                className={styles.rulesDesktop}
                onClick={() =>
                  onSetModal({
                    isOpen: true,
                    content: <Rules />,
                  })
                }>
                RULES
              </button>
            </>
          )}
          {page !== GamePage.Overview && (
            <>
              <button
                className={styles.rules}
                onClick={() =>
                  onSetModal({
                    isOpen: true,
                    content: <Rules />,
                  })
                }>
                <RulesIcon />
              </button>
              <button
                className={styles.stats}
                onClick={() =>
                  onSetModal({
                    isOpen: true,
                    content: stats[GameCode.Wordle] ? (
                      <Stats data={stats[GameCode.Wordle]} />
                    ) : null,
                  })
                }>
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
