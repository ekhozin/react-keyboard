import React from 'react';

import { KEYBOARD_ACTION_TYPES, KeyboardContext } from 'components/Keyboard';

function KeyboardForm() {
  const { dispatchKeyboardAction, keyboardState } = React.useContext(KeyboardContext);

  React.useEffect(() => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.REGISTER_ITEM,
      payload: { name: 'keyboard-input', value: 'test' },
    });

    return () => {
      dispatchKeyboardAction({
        type: KEYBOARD_ACTION_TYPES.UNREGISTER_ITEM,
        payload: { name: 'keyboard-input' },
      });
    };
  }, []);

  const handleChange = (e) => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.CHANGE_VALUE,
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFocus = (e) => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.FOCUS,
      payload: { name: e.target.name },
    });
  };
console.log('KeyboardForm::');
console.log(keyboardState);

  return (
    <div>
      <input
        name='keyboard-input'
        value={keyboardState['keyboard-input'] ? keyboardState['keyboard-input'].value : ''}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </div>
  );
}

export default KeyboardForm;
