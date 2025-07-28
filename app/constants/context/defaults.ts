import { ParthenonState } from '@/interfaces/context';

export const INITIAL_STATE: ParthenonState = {
  isUserFetched: false,
  modal: { isOpen: false, content: null },
  user: null,
};
