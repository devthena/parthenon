'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { API_URLS } from '@/constants/api';
import { GAME_OVER_STATUS_BLK } from '@/constants/cards';
import { INITIAL_BLACKJACK } from '@/constants/stats';

import { Loading } from '@/components';
import { BlackjackStatus, GameCode, GamePage } from '@/enums/games';
import { useBlackjack, useFetch, useParthenon } from '@/hooks';
import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { encrypt } from '@/lib/utils/encryption';

import { BlackjackStats, GameObject } from '@/interfaces/games';
import { UserObject } from '@/interfaces/user';

import { Balance, GameTable, Rules, Stats } from './components';
import styles from '../shared/styles/page.module.scss';

const Blackjack = () => {
  const {
    activeGames,
    isActiveGamesFetched,
    isStatsFetched,
    isUserFetched,
    stats,
    user,
    setStateActiveGame,
    setStateModal,
    setStateStats,
    setStateUser,
  } = useParthenon();

  const { fetchPatch, fetchPost } = useFetch();

  const {
    bet,
    dealerHand,
    deck,
    double,
    playerHand,
    status,
    onBetChange,
    onDouble,
    onHit,
    onPlay,
    onReset,
    onStand,
  } = useBlackjack();

  const [page, setPage] = useState(GamePage.Overview);
  const [isDataUpdated, setIsDataUpdated] = useState(true);

  const [dealerLastHand, setDealerLastHand] = useState([]);
  const [playerLastHand, setPlayerLastHand] = useState([]);

  const betRef = useRef(bet);
  const gameKeyRef = useRef<string | null>(null);

  const getGame = useCallback(async () => {
    if (!user || !user.discord_id) return;

    const game = await fetchPost(API_URLS.GAMES, {
      discord_id: user.discord_id,
      code: GameCode.Blackjack,
      data: {
        sessionKey: encrypt('' + betRef.current),
      },
    });

    setStateActiveGame(GameCode.Blackjack, game);
  }, [fetchPost, setStateActiveGame, user]);

  const updateGame = useCallback(async () => {
    if (!user || !user.discord_id || !gameKeyRef.current) return;

    const codeString = double ? status + '-double' : status;

    const game = await fetchPatch<GameObject>(API_URLS.GAMES, {
      discord_id: user.discord_id,
      key: gameKeyRef.current,
      code: GameCode.Blackjack,
      data: {
        sessionCode: encrypt(codeString),
      },
    });

    setStateActiveGame(GameCode.Blackjack, game);
  }, [double, fetchPatch, setStateActiveGame, status, user]);

  const updateStats = useCallback(
    async (payload: BlackjackStats) => {
      if (!stats) return;

      setStateStats({
        ...stats,
        [GameCode.Blackjack]: { ...payload },
      });
    },
    [setStateStats, stats]
  );

  const updateUser = useCallback(
    async (payload: Partial<UserObject>) => {
      if (!user) return;
      setStateUser({ ...user, ...payload });
    },
    [setStateUser, user]
  );

  useEffect(() => {
    betRef.current = bet;
  }, [bet]);

  useEffect(() => {
    if (!isActiveGamesFetched) return;
    if (!activeGames) return;

    const game = activeGames[GameCode.Blackjack];
    if (game && game.key) gameKeyRef.current = game.key;
  }, [activeGames, isActiveGamesFetched]);

  useEffect(() => {
    if (!user || !user.discord_username || !bet || isDataUpdated) return;

    if (GAME_OVER_STATUS_BLK.includes(status)) {
      setIsDataUpdated(true);
      updateGame();

      const newStats =
        stats && stats[GameCode.Blackjack]
          ? stats[GameCode.Blackjack]
          : INITIAL_BLACKJACK;

      newStats.totalPlayed += 1;

      if (status === BlackjackStatus.Blackjack) {
        updateStats({
          ...newStats,
          totalBlackjack: newStats.totalBlackjack + 1,
          totalWon: newStats.totalWon + 1,
        });

        const reward = double ? bet + bet * 2 : bet + Math.round(bet * 1.5);

        updateUser({
          ...user,
          cash: user.cash + reward,
        });
      } else if (
        status === BlackjackStatus.Win ||
        status === BlackjackStatus.DealerBust
      ) {
        updateStats({
          ...newStats,
          totalWon: newStats.totalWon + 1,
        });

        const reward = double ? bet + bet * 2 : bet * 2;

        updateUser({
          ...user,
          cash: user.cash + reward,
        });
      } else if (status === BlackjackStatus.Push) {
        updateUser({
          ...user,
          cash: user.cash + bet,
        });
      } else {
        if (double) {
          updateUser({
            ...user,
            cash: user.cash - bet,
          });
        }
      }
    }
  }, [
    bet,
    double,
    isDataUpdated,
    stats,
    status,
    updateGame,
    updateStats,
    updateUser,
    user,
  ]);

  useEffect(() => {
    if (status === BlackjackStatus.Playing && isDataUpdated) {
      setIsDataUpdated(false);
    }
  }, [status, isDataUpdated]);

  if (isUserFetched && (!user || !user?.discord_username))
    redirect('/dashboard');

  return (
    <div className={styles.blackjack}>
      <div className={styles.header}>
        <div className={styles.leftButtons}>
          {page !== GamePage.Overview && (
            <>
              <button
                className={styles.back}
                onClick={() => {
                  onReset();
                  setDealerLastHand([]);
                  setPlayerLastHand([]);
                  setPage(GamePage.Overview);
                }}>
                <BackIcon />
              </button>
              <button
                className={styles.backDesktop}
                onClick={() => {
                  onReset();
                  setDealerLastHand([]);
                  setPlayerLastHand([]);
                  setPage(GamePage.Overview);
                }}>
                <BackIcon />
                <span>QUIT</span>
              </button>
            </>
          )}
        </div>
        <h1>BLACKJACK</h1>
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
                    content: stats && (
                      <Stats data={stats[GameCode.Blackjack]} />
                    ),
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
          <p className={styles.description}>
            Adjust your bet then hit PLAY when ready!
          </p>
          {!isUserFetched && <Loading />}
          {isUserFetched && user && (
            <>
              <Balance bet={bet} cash={user.cash} onUpdate={onBetChange} />
              <button
                className={`${styles.play} ${styles.casino}`}
                disabled={!bet || bet > user.cash || user.cash === 0}
                onClick={() => {
                  if (bet) {
                    setPage(GamePage.Playing);
                    getGame();
                    onPlay(bet);
                    updateUser({
                      ...user,
                      cash: user.cash - bet,
                    });
                  }
                }}>
                PLAY
              </button>
            </>
          )}
          <div className={styles.statsContainer}>
            {!isStatsFetched && <Loading />}
            {isStatsFetched && stats && (
              <Stats data={stats[GameCode.Blackjack]} />
            )}
          </div>
        </div>
      )}
      {page === GamePage.Playing && (
        <div className={styles.playing}>
          {(!isUserFetched || !isActiveGamesFetched) && <Loading />}
          {isUserFetched && user && isActiveGamesFetched && (
            <GameTable
              bet={bet}
              cash={user.cash}
              deckSize={deck.length}
              dealerLastHand={dealerLastHand}
              dealerHand={dealerHand}
              double={double}
              getGame={getGame}
              playerLastHand={playerLastHand}
              playerHand={playerHand}
              status={status}
              setDealerLastHand={setDealerLastHand}
              setPlayerLastHand={setPlayerLastHand}
              onBetChange={onBetChange}
              onDouble={onDouble}
              onHit={onHit}
              onPlay={onPlay}
              onStand={onStand}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Blackjack;
