import { BackspaceIcon } from '../../../../icons';
import { keyIds } from '../../../../lib/constants/wordle';
import { KeyStatus } from '../../../../lib/enums/wordle';

import styles from '../styles/keyboard.module.scss';

interface KeyboardProps {
  keyResults: { [letter: string]: KeyStatus };
  onDelete: () => void;
  onEnter: () => void;
  onKey: (key: string) => void;
}

export const Keyboard = ({
  keyResults,
  onDelete,
  onEnter,
  onKey,
}: KeyboardProps) => {
  const renderKey = (letter: string) => {
    const isBackspace = letter === 'Backspace';
    const keyResult = keyResults[letter] || 'none';

    const styleClass = isBackspace
      ? `${styles.backspace} ${styles[keyResult]}`
      : styles[keyResult];

    return (
      <button
        key={letter}
        className={styleClass}
        onClick={() => {
          if (isBackspace) onDelete();
          else if (letter === 'Enter') onEnter();
          else onKey(letter);
        }}>
        {isBackspace ? <BackspaceIcon /> : letter}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      {keyIds.map((row, i) => (
        <div className={styles.row} key={i}>
          {row.map(id => renderKey(id))}
        </div>
      ))}
    </div>
  );
};
