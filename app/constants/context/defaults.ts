import { ParthenonState } from '@/interfaces/context';

export const INITIAL_STATE: ParthenonState = {
  activeGames: {},
  isActiveGamesFetched: false,
  isUserFetched: false,
  modal: { isOpen: false, content: null },
  user: null,
};
