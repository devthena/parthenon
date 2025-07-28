import { ModalState } from '@/interfaces/modal';
import { UserDocument } from '@/interfaces/user';

export interface ParthenonState {
  isUserFetched: boolean;
  modal: ModalState;
  user: UserDocument | null;
}

export type ParthenonAction =
  | { type: 'SET_MODAL'; payload: Partial<ModalState> }
  | { type: 'SET_USER'; payload: UserDocument | null };

export interface ParthenonContextType {
  state: ParthenonState;
  dispatch: React.Dispatch<ParthenonAction>;
}
