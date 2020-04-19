import React from 'react';
import PropTypes from 'prop-types';

import { KEY_CODES } from './keyCodes';
import { Key } from './Key';
import styles from './styles.scss';

function Keyboard(props) {
  const { onKeyClick, onKeyboardMouseDown } = props;

  const renderKeys = React.useMemo(() => Object.entries(KEY_CODES).map((key) => {
    const [ ,keyCode ] = key;

    return (
      <div key={keyCode} className={styles.KeyWrapper} onClick={onKeyClick}>
        <Key keyCode={keyCode}>
          {keyCode}
        </Key>
      </div>
    );
  }), []);

  return (
    <div className={styles.Keyboard} onMouseDown={onKeyboardMouseDown}>
      {renderKeys}
    </div>
  );
}

Keyboard.propTypes = {
  onKeyClick: PropTypes.func,
  onKeyboardMouseDown: PropTypes.func,
};

Keyboard.defaultProps = {
  onKeyClick: () => {},
  onKeyboardMouseDown: () => {},
};

const KeyboardMemo = React.memo(Keyboard);

export { KeyboardMemo as Keyboard };
