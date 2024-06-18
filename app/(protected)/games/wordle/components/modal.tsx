import { useWordle } from '../../../../hooks';
import { CloseIcon } from '../../../../images/icons';

import { ModalContent } from '../../../../lib/enums/wordle';
import { WordleObject } from '../../../../lib/types/wordle';

import { Rules } from './rules';
import { Stats } from './stats';

import styles from '../styles/modal.module.scss';

interface ModalProps {
  content: ModalContent;
  stats: WordleObject | null;
  onModalClose: () => void;
}

export const Modal = ({ content, stats, onModalClose }: ModalProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.buttonContainer}>
          <button className={styles.close} onClick={() => onModalClose()}>
            <CloseIcon />
          </button>
        </div>
        {content === ModalContent.Rules && (
          <div className={styles.formContainer}>
            <Rules />
          </div>
        )}
        {content === ModalContent.Stats && (
          <div className={styles.statsContainer}>
            {stats && <Stats data={stats} />}
          </div>
        )}
      </div>
    </div>
  );
};