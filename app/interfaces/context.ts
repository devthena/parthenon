import { GameCode } from '@/enums/games';
import { GameDocument } from '@/interfaces/games';
import { ModalState } from '@/interfaces/modal';
import { StatDocument } from '@/interfaces/stat';
import { UserDocument } from '@/interfaces/user';

export interface ParthenonState {
  activeGames: Partial<Record<GameCode, GameDocument>> | null;
  isActiveGamesFetched: boolean;
  isStatsFetched: boolean;
  isUserFetched: boolean;
  modal: ModalState;
  stats: StatDocument | null;
  user: UserDocument | null;
}

export type ParthenonAction =
  | {
      type: 'SET_ACTIVE_GAME';
      payload: { code: GameCode; data: GameDocument | null };
    }
  | { type: 'SET_ACTIVE_GAMES'; payload: GameDocument[] }
  | { type: 'SET_MODAL'; payload: Partial<ModalState> }
  | { type: 'SET_STATS'; payload: StatDocument | null }
  | { type: 'SET_USER'; payload: UserDocument | null };

export interface ParthenonContextType {
  state: ParthenonState;
  dispatch: React.Dispatch<ParthenonAction>;
}
