'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Loading } from '@/components';
import { useBlackjack, useFetch, useParthenon } from '@/hooks';

import { API_URLS } from '@/constants/api';
import { GAME_OVER_STATUS_BLK } from '@/constants/cards';
import { INITIAL_STATS } from '@/constants/stats';

import {
  BlackjackStatus,
  GameCode,
  GamePage,
  GameRequest,
} from '@/enums/games';

import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { GameDocument } from '@/interfaces/games';
import { encrypt } from '@/lib/utils/encryption';

import { Balance, GameTable, Rules, Stats } from './components';
import styles from '../shared/styles/page.module.scss';

const Blackjack = () => {
  const {
    activeGames,
    isActiveGamesFetched,
    isUserFetched,
    stats,
    user,
    onSetStats,
    setStateActiveGame,
    setStateModal,
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

  const getStats = useCallback(async () => {
    await fetchPost(API_URLS.STATS, {
      code: GameCode.Blackjack,
    });
  }, [fetchPost]);

  const getGame = useCallback(async () => {
    if (!user || !user.discord_id) return;

    await fetchPost(API_URLS.GAMES, {
      discord_id: user.discord_id,
      code: GameCode.Blackjack,
      type: GameRequest.Create,
      data: {
        sessionKey: encrypt('' + betRef.current),
      },
    });
  }, [fetchPost]);

  const updateGame = useCallback(async () => {
    if (!user || !user.discord_id || !gameKeyRef.current) return;

    const codeString = double ? status + '-double' : status;

    const game = await fetchPatch<GameDocument>(API_URLS.GAMES, {
      discord_id: user.discord_id,
      key: gameKeyRef.current,
      code: GameCode.Blackjack,
      data: {
        sessionCode: encrypt(codeString),
      },
    });

    setStateActiveGame(GameCode.Blackjack, game);
  }, [double, fetchPatch, status]);

  useEffect(() => {
    if (!stats[GameCode.Blackjack]) getStats();
  }, []);

  useEffect(() => {
    if (!isApiFetched || !dataStats || stats[GameCode.Blackjack]) return;
    onSetStats(dataStats);
  }, [dataStats, isApiFetched, stats, onSetStats]);

  useEffect(() => {
    betRef.current = bet;
  }, [bet]);

  useEffect(() => {
    const game = activeGames[GameCode.Blackjack];
    if (game && game.key) gameKeyRef.current = game.key;
  }, [activeGames[GameCode.Blackjack]]);

  useEffect(() => {
    if (!user || !user.discord_username || !bet || isDataUpdated) return;

    if (GAME_OVER_STATUS_BLK.includes(status)) {
      setIsDataUpdated(true);
      updateGame();

      const newStats =
        stats[GameCode.Blackjack] ?? INITIAL_STATS[GameCode.Blackjack];

      newStats.totalPlayed += 1;

      if (status === BlackjackStatus.Blackjack) {
        onSetStats({
          [GameCode.Blackjack]: {
            ...newStats,
            totalBlackjack: newStats.totalBlackjack + 1,
            totalWon: newStats.totalWon + 1,
          },
        });

        const reward = double ? bet + bet * 2 : bet + Math.round(bet * 1.5);

        setStateUser({
          ...user,
          cash: user.cash + reward,
        });
      } else if (
        status === BlackjackStatus.Win ||
        status === BlackjackStatus.DealerBust
      ) {
        onSetStats({
          [GameCode.Blackjack]: {
            ...newStats,
            totalWon: newStats.totalWon + 1,
          },
        });

        const reward = double ? bet + bet * 2 : bet * 2;

        onSetUser({
          ...user,
          cash: user.cash + reward,
        });
      } else if (status === BlackjackStatus.Push) {
        onSetUser({
          ...user,
          cash: user.cash + bet,
        });
      } else {
        if (double) {
          onSetUser({
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
    onSetStats,
    onSetUser,
    stats,
    status,
    updateGame,
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
                    content: stats[GameCode.Blackjack] ? (
                      <Stats data={stats[GameCode.Blackjack]} />
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
                    setStateUser({
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
            {(isLoading || !stats[GameCode.Blackjack]) && <Loading />}
            {!isLoading && stats[GameCode.Blackjack] && (
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
