import { useParthenonState } from '@/context';
import { CloseIcon } from '@/images/icons';

import styles from '@/styles/modal.module.scss';

export const Modal = () => {
  const { modal, onSetModal } = useParthenonState();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.buttonContainer}>
          <button
            className={styles.close}
            onClick={() => onSetModal({ isOpen: false })}>
            <CloseIcon />
          </button>
        </div>
        <div>{modal.content}</div>
      </div>
    </div>
  );
};
