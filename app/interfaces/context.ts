import { GameCode } from '@/enums/games';
import { ModalState } from '@/interfaces/modal';
import { UserDocument } from '@/interfaces/user';
import { GameDocument } from './games';

export interface ParthenonState {
  activeGames: Partial<Record<GameCode, GameDocument>>;
  isActiveGamesFetched: boolean;
  isUserFetched: boolean;
  modal: ModalState;
  user: UserDocument | null;
}

export type ParthenonAction =
  | {
      type: 'SET_ACTIVE_GAME';
      payload: { code: GameCode; data: GameDocument | null };
    }
  | { type: 'SET_ACTIVE_GAMES'; payload: GameDocument[] }
  | { type: 'SET_MODAL'; payload: Partial<ModalState> }
  | { type: 'SET_USER'; payload: UserDocument | null };

export interface ParthenonContextType {
  state: ParthenonState;
  dispatch: React.Dispatch<ParthenonAction>;
}
