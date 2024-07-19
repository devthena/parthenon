import { Metadata } from 'next';

import Wordle from './wordle';

export const metadata: Metadata = {
  title: 'Parthenon | Wordle',
};

const WordlePage = () => <Wordle />;
export default WordlePage;
