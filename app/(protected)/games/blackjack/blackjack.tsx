'use client';

import { useState } from 'react';

import { Loading } from '@/components';
import { useParthenonState } from '@/context';
import { GameCode, GamePage } from '@/enums/games';
import { BackIcon, RulesIcon, StatsIcon } from '@/images/icons';

import { Rules, Stats } from './components';
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

  const [page, setPage] = useState(GamePage.Overview);

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
      {page === GamePage.Overview && <div className={styles.overview}></div>}
      {page === GamePage.Playing && (
        <div className={styles.playing}>
          {(isLoading || !games[GameCode.Blackjack]) && <Loading />}
        </div>
      )}
    </div>
  );
};

export default Blackjack;
