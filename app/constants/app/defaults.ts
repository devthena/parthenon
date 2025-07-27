import { ParthenonState } from '@/interfaces/context';

export const INITIAL_STATE: ParthenonState = {
  modal: { isOpen: false, content: null },
  user: null,
};
