import { BackspaceIcon } from '../../../../icons';
import { KeyboardProps, KeyTileProps } from '../../../../lib/types/wordle';

import styles from '../styles/keyboard.module.scss';

export const Keyboard = ({ colors, keys, onKeyUp }: KeyboardProps) => {
  const KeyTile = ({ id }: KeyTileProps) => {
    const isBackspace = id === 'Backspace';
    const isEnter = id === 'Enter';

    let styleNames;

    if (colors[id]) styleNames = styles[colors[id]];
    else if (isBackspace) styleNames = styles.backspace;
    else if (isEnter) styleNames = styles.enter;

    return (
      <button className={styleNames} onClick={() => onKeyUp(id)}>
        {isBackspace ? <BackspaceIcon /> : id}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      {keys.map((row, i) => (
        <div className={styles.row} key={i}>
          {row.map(id => (
            <KeyTile id={id} key={id} />
          ))}
        </div>
      ))}
    </div>
  );
};
