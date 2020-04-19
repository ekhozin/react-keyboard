import React from 'react';

import { KeyboardContext } from './KeyboardContext';
import { Keyboard } from './Keyboard';

function KeyboardWithContext() {
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

  return <Keyboard onKeyboardMouseDown={handleMouseDown} onKeyClick={handleKeyClick}/>;
}

export { KeyboardWithContext };
