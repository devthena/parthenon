'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Loading } from '@/components';
import { useFetch, useParthenon, useWordle } from '@/hooks';

import { API_URLS } from '@/constants/api';
import { MAX_ATTEMPTS, WORD_LENGTH, WORD_LIST } from '@/constants/wordle';
import { GameCode, GamePage } from '@/enums/games';
import { WordleKeyStatus, WordleStatus } from '@/enums/games';

import { GameObject, WordleGuess } from '@/interfaces/games';
import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { encrypt } from '@/lib/utils';

import { AnswerGrid, Keyboard, Notice, Rules, Stats } from './components';
import styles from '../shared/styles/page.module.scss';

const Wordle = () => {
  const {
    isActiveGamesFetched,
    isStatsFetched,
    isUserFetched,
    setStateActiveGame,
    setStateModal,
    setStateStats,
    setStateUser,
    stats,
    user,
  } = useParthenon();

  const { fetchDelete, fetchPatch, fetchPost } = useFetch();

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
  const gameKeyRef = useRef<string | undefined>(null);
  const gameStatusRef = useRef(status);

  const getGame = useCallback(async () => {
    const game = await fetchPost<GameObject>(API_URLS.GAMES, {
      code: GameCode.Wordle,
      data: {
        sessionKey: encrypt(answerRef.current),
      },
    });

    if (game) gameKeyRef.current = game.key;
    setStateActiveGame(GameCode.Wordle, game);
  }, [fetchPost, setStateActiveGame]);

  const updateGame = useCallback(
    async (guess: string) => {
      if (!gameKeyRef.current) return;

      const game = await fetchPatch<GameObject>(API_URLS.GAMES, {
        key: gameKeyRef.current,
        code: GameCode.Wordle,
        data: {
          sessionCode: encrypt(guess),
        },
      });

      if (game) gameKeyRef.current = game.key;
      setStateActiveGame(GameCode.Blackjack, game);
    },
    [fetchPatch, setStateActiveGame]
  );

  const modifiedEnter = useCallback(async () => {
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
  }, [onEnter, onPlay, updateGame]);

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
    gameStatusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (
      !user ||
      !user.discord_id ||
      !stats ||
      !stats[GameCode.Wordle] ||
      isStatsUpdated
    )
      return;

    if (status === WordleStatus.Answered) {
      setIsStatsUpdated(true);

      const newDistribution = [...stats[GameCode.Wordle].distribution];
      newDistribution[guesses.length - 1] += 1;

      setStateStats({
        discord_id: user.discord_id,
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
        setStateUser({
          ...user,
          cash: user.cash + reward,
        });
      }
    } else if (status === WordleStatus.Completed) {
      setIsStatsUpdated(true);

      setStateStats({
        discord_id: user.discord_id,
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
    setStateStats,
    setStateUser,
    stats,
    status,
    user,
  ]);

  useEffect(() => {
    if (status === WordleStatus.Playing && isStatsUpdated) {
      setIsStatsUpdated(false);
    }
  }, [status, isStatsUpdated]);

  if (isUserFetched && (!user || !user?.discord_id)) redirect('/dashboard');

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
                  setStateModal({
                    isOpen: true,
                    content: <Rules />,
                  })
                }>
                <RulesIcon />
              </button>
              <button
                className={styles.rulesDesktop}
                onClick={() =>
                  setStateModal({
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
                  setStateModal({
                    isOpen: true,
                    content: <Rules />,
                  })
                }>
                <RulesIcon />
              </button>
              <button
                className={styles.stats}
                onClick={() =>
                  setStateModal({
                    isOpen: true,
                    content: stats && <Stats data={stats[GameCode.Wordle]} />,
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
            {!isStatsFetched && <Loading />}
            {isStatsFetched && stats && <Stats data={stats[GameCode.Wordle]} />}
          </div>
        </div>
      )}
      {page === GamePage.Playing && (
        <div className={styles.playing}>
          {!isActiveGamesFetched && <Loading />}
          {isActiveGamesFetched && (
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
