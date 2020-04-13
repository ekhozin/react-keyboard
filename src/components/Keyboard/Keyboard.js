import React from 'react';
import PropTypes from 'prop-types';

import { KEYBOARD_ACTION_TYPES } from './actionTypes';
import { KEY_CODES } from './keyCodes';
import KeyboardContext from './KeyboardContext';
import Key from './Key';
import styles from './styles.scss';

function Keyboard(props) {
  const { id } = props;

  const { dispatchKeyboardAction } = React.useContext(KeyboardContext);

  React.useEffect(() => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.REGISTER_KEYBOARD,
      payload: { id },
    });

    return () => {
      dispatchKeyboardAction({
        type: KEYBOARD_ACTION_TYPES.UNREGISTER_KEYBOARD,
        payload: { id },
      });
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const code = e.target.getAttribute('data-code');

    if (!code) {
      return;
    }

    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.PRESS_KEY,
      payload: { keyCode: code },
    });
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
    <div id={id} className={styles.Keyboard} onMouseDown={handleMouseDown}>
      {renderKeys()}
    </div>
  );
}

Keyboard.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Keyboard;
