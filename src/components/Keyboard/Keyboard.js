import React from 'react';

import useKeyboard from './useKeyboard';
import { KEYBOARD_ACTION_TYPES } from './actionTypes';
import { KEY_CODES } from './keyCodes';
import KeyboardContext from './KeyboardContext';
import Key from './Key';
import styles from './styles.scss';

function Keyboard() {
  const { dispatchKeyboardAction } = React.useContext(KeyboardContext);

  const onKeyClick = (keyCode) => () => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.PRESS_KEY,
      payload: { keyCode },
    });
  };

  const renderKeys = () => Object.entries(KEY_CODES).map((key) => {
    const [ ,keyCode ] = key;

    return (
      <div key={keyCode} className={styles.KeyWrapper}>
        <Key onClick={onKeyClick(keyCode)}>
          {keyCode}
        </Key>
      </div>
    );
  });

  return (
    <div className={styles.Keyboard}>
      {renderKeys()}
    </div>
  );
}

export default Keyboard;
