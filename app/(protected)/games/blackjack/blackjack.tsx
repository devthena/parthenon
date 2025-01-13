'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useApi, useBlackjack } from '@/hooks';

import { ApiDataType, ApiUrl } from '@/enums/api';
import { GameCode, GamePage } from '@/enums/games';

import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';

import { Balance, Rules, Stats } from './components';
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
    error,
    isFetched: isApiFetched,
    clearError,
    fetchPostData,
  } = useApi();

  const { bet, startGame, updateBet } = useBlackjack();

  const [isStatsUpdated, setIsStatsUpdated] = useState(false);
  const [page, setPage] = useState(GamePage.Overview);

  const getStats = useCallback(async () => {
    await fetchPostData(ApiUrl.Stats, ApiDataType.Stats, {
      code: GameCode.Blackjack,
    });
  }, [fetchPostData]);

  useEffect(() => {
    if (!stats[GameCode.Blackjack]) getStats();
  }, []);

  useEffect(() => {
    if (!isApiFetched || !dataStats || stats[GameCode.Blackjack]) return;
    onSetStats(dataStats);
  }, [dataStats, isApiFetched, stats, onSetStats]);

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
                  // onReset();
                  setPage(GamePage.Overview);
                }}>
                <BackIcon />
              </button>
              <button
                className={styles.backDesktop}
                onClick={() => {
                  // onReset();
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
              <Balance bet={bet} cash={user.cash} onUpdate={updateBet} />
              <button
                className={`${styles.play} ${styles.casino}`}
                disabled={!bet || bet > user.cash || user.cash === 0}
                onClick={() => {
                  if (bet) startGame(bet);
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
          {(isLoading || !games[GameCode.Blackjack]) && <Loading />}
        </div>
      )}
    </div>
  );
};

export default Blackjack;
