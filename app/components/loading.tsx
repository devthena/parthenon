import styles from '../styles/loading.module.scss';

export const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dualRing}></div>
    </div>
  );
};
