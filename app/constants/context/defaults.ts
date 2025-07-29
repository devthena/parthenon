import { ParthenonState } from '@/interfaces/context';

export const INITIAL_STATE: ParthenonState = {
  activeGames: null,
  isActiveGamesFetched: false,
  isStatsFetched: false,
  isUserFetched: false,
  modal: { isOpen: false, content: null },
  stats: null,
  user: null,
};
