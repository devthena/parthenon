'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useApi, useBlackjack } from '@/hooks';

import { ApiDataType, ApiUrl } from '@/enums/api';

import {
  BlackjackStatus,
  GameCode,
  GamePage,
  GameRequestType,
} from '@/enums/games';

import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';
import { encrypt } from '@/lib/utils/encryption';

import { Balance, GameTable, Rules, Stats } from './components';
import styles from '../shared/styles/page.module.scss';

const Blackjack = () => {
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
    isFetched: isApiFetched,
    fetchPostData,
  } = useApi();

  const {
    bet,
    dealerHand,
    deck,
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
  const [dealerLastHand, setDealerLastHand] = useState([]);
  const [playerLastHand, setPlayerLastHand] = useState([]);

  const betRef = useRef(bet);
  const gameKeyRef = useRef(games[GameCode.Blackjack]);

  const getStats = useCallback(async () => {
    await fetchPostData(ApiUrl.Stats, ApiDataType.Stats, {
      code: GameCode.Blackjack,
    });
  }, [fetchPostData]);

  const getGame = useCallback(async () => {
    await fetchPostData(ApiUrl.Games, ApiDataType.Games, {
      code: GameCode.Blackjack,
      type: GameRequestType.Create,
      data: {
        sessionKey: encrypt('' + betRef.current),
      },
    });
  }, [fetchPostData]);

  const updateGame = async (status: BlackjackStatus, isDouble: boolean) => {
    if (!gameKeyRef.current) return;

    const codeString = isDouble ? status + '-double' : status;

    await fetchPostData(
      ApiUrl.Games,
      ApiDataType.Games,
      {
        key: gameKeyRef.current,
        code: GameCode.Blackjack,
        type: GameRequestType.Update,
        data: {
          sessionCode: encrypt(codeString),
        },
      },
      true
    );
  };

  useEffect(() => {
    if (!stats[GameCode.Blackjack]) getStats();
  }, []);

  useEffect(() => {
    if (!isApiFetched || !dataStats || stats[GameCode.Blackjack]) return;
    onSetStats(dataStats);
  }, [dataStats, isApiFetched, stats, onSetStats]);

  useEffect(() => {
    if (!isApiFetched || !dataGame) return;
    onSetGame(dataGame);
  }, [dataGame, isApiFetched, onSetGame]);

  useEffect(() => {
    betRef.current = bet;
  }, [bet]);

  useEffect(() => {
    gameKeyRef.current = games[GameCode.Blackjack];
  }, [games]);

  useEffect(() => {
    if (status === BlackjackStatus.Playing) getGame();
  }, [status]);

  if (isFetched && (!user || !user?.discord_username)) redirect('/dashboard');

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
          {(isLoading || !user) && <Loading />}
          {!isLoading && user && (
            <>
              <Balance bet={bet} cash={user.cash} onUpdate={onBetChange} />
              <button
                className={`${styles.play} ${styles.casino}`}
                disabled={!bet || bet > user.cash || user.cash === 0}
                onClick={() => {
                  if (bet) {
                    setPage(GamePage.Playing);
                    onPlay(bet);
                    onSetUser({
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
            {!isLoading && stats[GameCode.Blackjack] && (
              <Stats data={stats[GameCode.Blackjack]} />
            )}
          </div>
        </div>
      )}
      {page === GamePage.Playing && (
        <div className={styles.playing}>
          {(isLoading || !user || !games[GameCode.Blackjack]) && <Loading />}
          {!isLoading && user && games[GameCode.Blackjack] && (
            <GameTable
              bet={bet}
              cash={user.cash}
              deckSize={deck.length}
              dealerLastHand={dealerLastHand}
              dealerHand={dealerHand}
              playerLastHand={playerLastHand}
              playerHand={playerHand}
              status={status}
              setDealerLastHand={setDealerLastHand}
              setPlayerLastHand={setPlayerLastHand}
              updateGame={updateGame}
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
