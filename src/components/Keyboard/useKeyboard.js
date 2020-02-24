import React from 'react';
import KeyboardContext from './KeyboardContext';
import { KEYBOARD_ACTION_TYPES } from './actionTypes';

function useKeyboard() {
  const initialState = React.useContext(KeyboardContext);

  function handleRegisterItem(state, action) {
    const { payload } = action;

    return {
      ...state,
      [payload.name]: {
        value: payload.value,
        focused: false,
        caretPosition: 0,
      },
    };
  }

  function handleUnregisterItem(state, action) {
    const { payload } = action;

    return Object.entries(state).reduce((acc, item) => {
      const [name, params] = item;

      if (name === payload.name) {
        return acc;
      }

      return { ...acc, [name]: params };
    }, {});
  }

  function handlePressKey(state, action) {
    const { payload } = action;
    console.log('handlePressKey::');
    console.log(state);

    // TODO: 1) handle caret position
    // TODO: 2) handle key types
    return Object.entries(state).reduce((acc, item) => {
      const [name, params] = item;

      if (!params.focused) {
        return acc;
      }

      return {
        ...acc,
        [name]: {
          ...params,
          value: params.value + payload.keyCode,
        },
      };
    }, {});
  }

  function handleChangeValue(state, action) {
    const { payload } = action;

    return {
      ...state,
      [payload.name]: {
        ...state[payload.name],
        value: payload.value,
      },
    };
  }

  function handleFocus(state, action) {
    const { payload } = action;

    return {
      ...state,
      [payload.name]: {
        ...state[payload.name],
        focused: true,
        caretPosition: 0,
      },
    };
  }

  function handleBlur(state, action) {
    const { payload } = action;

    return {
      ...state,
      [payload.name]: {
        ...state[payload.name],
        focused: false,
        caretPosition: 0,
      },
    };
  }

  const reducer = (state, action) => {
    console.log('action::');
    console.log(action);
    switch (action.type) {
      case KEYBOARD_ACTION_TYPES.REGISTER_ITEM:
        return handleRegisterItem(state, action);
      case KEYBOARD_ACTION_TYPES.UNREGISTER_ITEM:
        return handleUnregisterItem(state, action);
      case KEYBOARD_ACTION_TYPES.PRESS_KEY:
        return handlePressKey(state, action);
      case KEYBOARD_ACTION_TYPES.CHANGE_VALUE:
        return handleChangeValue(state, action);
      case KEYBOARD_ACTION_TYPES.FOCUS:
        return handleFocus(state, action);
      case KEYBOARD_ACTION_TYPES.BLUR:
        return handleBlur(state, action);
      default:
        return state;
    }
  };

  const [keyboardState, dispatchKeyboardAction] = React.useReducer(reducer, initialState);

  return {
    keyboardState,
    dispatchKeyboardAction,
  };
}

export default useKeyboard;
