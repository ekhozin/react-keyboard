import React from 'react';

import { KEY_CODES } from './keyCodes';
import { KeyboardContext } from './KeyboardContext';
import Key from './Key';
import styles from './styles.scss';

function Keyboard() {
  const { actions } = React.useContext(KeyboardContext);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const code = e.target.getAttribute('data-code');

    if (!code) {
      return;
    }

    actions.pressKey(code);
  };

  const handleKeyClick = (e) => {
    e.preventDefault();
  };

  const renderKeys = () => Object.entries(KEY_CODES).map((key) => {
    const [ ,keyCode ] = key;

    return (
      <div key={keyCode} className={styles.KeyWrapper} onClick={handleKeyClick}>
        <Key keyCode={keyCode}>
          {keyCode}
        </Key>
      </div>
    );
  });

  return (
    <div className={styles.Keyboard} onMouseDown={handleMouseDown}>
      {renderKeys()}
    </div>
  );
}

export { Keyboard };
