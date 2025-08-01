import { ReactElement } from 'react';

export interface ModalState {
  isOpen: boolean;
  content: ReactElement | null;
}
