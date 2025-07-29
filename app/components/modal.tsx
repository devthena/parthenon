import { useParthenon } from '@/hooks';
import { CloseIcon } from '@/images/icons';

import styles from '@/styles/modal.module.scss';

export const Modal = () => {
  const { modal, setStateModal } = useParthenon();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.buttonContainer}>
          <button
            className={styles.close}
            onClick={() => setStateModal({ isOpen: false })}>
            <CloseIcon />
          </button>
        </div>
        <div>{modal.content}</div>
      </div>
    </div>
  );
};
