import { ModalState } from '@/interfaces/modal';
import { UserDocument } from '@/interfaces/user';

export interface ParthenonState {
  modal: ModalState;
  user: UserDocument | null;
}

export type ParthenonAction =
  | { type: 'SET_MODAL'; payload: ModalState }
  | { type: 'SET_USER'; payload: UserDocument };

export interface ParthenonContextType {
  state: ParthenonState;
  dispatch: React.Dispatch<ParthenonAction>;
}
