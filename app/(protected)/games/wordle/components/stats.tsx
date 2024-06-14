import { Bar } from 'react-chartjs-2';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables, ChartDataLabels);

import { WordleObject } from '../../../../lib/types/db';

import styles from '../styles/stats.module.scss';

export const Stats = ({ data }: { data: WordleObject }) => {
  const winPercentage = !data?.totalPlayed
    ? 'N/A'
    : Math.round((data.totalWon / data.totalPlayed) * 100) + '%';

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <p>Win Percentage: {winPercentage}</p>
        <p>Max Streak: {data.maxStreak}</p>
        <p>Current Streak: {data.currentStreak}</p>
        <p>Total Times Played: {data.totalPlayed}</p>
        <p>Guess Distribution</p>
      </div>
      <Bar
        className={styles.chart}
        options={{
          indexAxis: 'y',
          layout: {
            padding: {
              left: 10,
              right: 20,
            },
          },
          plugins: {
            datalabels: {
              align: 'end',
              anchor: 'end',
              display: (context: Context) =>
                context.dataset.data[context.dataIndex] !== 0,
              offset: 0,
            },
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            x: {
              ticks: {
                display: false,
              },
            },
          },
        }}
        data={{
          labels: ['1', '2', '3', '4', '5', '6'],
          datasets: [
            {
              data: data.distribution,
              backgroundColor: 'rgba(106, 170, 100, 0.5)',
              borderColor: 'rgb(106, 170, 100)',
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
};
