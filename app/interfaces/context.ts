import { GameCode } from '@/enums/games';
import { GameObject } from '@/interfaces/games';
import { ModalState } from '@/interfaces/modal';
import { StatObject } from '@/interfaces/stat';
import { UserObject } from '@/interfaces/user';

export interface ParthenonState {
  activeGames: Partial<Record<GameCode, GameObject>> | null;
  isActiveGamesFetched: boolean;
  isStatsFetched: boolean;
  isUserFetched: boolean;
  modal: ModalState;
  stats: StatObject | null;
  user: UserObject | null;
}

export type ParthenonAction =
  | {
      type: 'SET_ACTIVE_GAME';
      payload: { code: GameCode; data: GameObject | null };
    }
  | { type: 'SET_ACTIVE_GAMES'; payload: GameObject[] }
  | { type: 'SET_MODAL'; payload: Partial<ModalState> }
  | { type: 'SET_STATS'; payload: StatObject | null }
  | { type: 'SET_USER'; payload: UserObject | null };

export interface ParthenonContextType {
  state: ParthenonState;
  dispatch: React.Dispatch<ParthenonAction>;
}
