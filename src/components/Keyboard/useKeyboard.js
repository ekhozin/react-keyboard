import React from 'react';
import { KEYBOARD_ACTION_TYPES } from './actionTypes';

function useKeyboard() {
  const initialState = {
    fields: {},
    activeField: {},
    keyboards: {},
  };

  function handleRegisterItem(state, payload) {
    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: {
          value: payload.value,
          focused: false,
          caretPosition: 0,
        },
      },
    };
  }

  function handleUnregisterItem(state, payload) {
    const fields = Object.entries(state.fields).reduce((acc, item) => {
      const [name, params] = item;

      if (name === payload.name) {
        return acc;
      }

      return { ...acc, [name]: params };
    }, {});

    return { ...state, fields };
  }

  function handlePressKey(state, payload) {
    // TODO: 1) handle caret position
    // TODO: 2) handle key types
    const fields = Object.entries(state.fields).reduce((acc, item) => {
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
    }, state.fields);

    return { ...state, fields };
  }

  function handleChangeValue(state, payload) {
    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: {
          ...state.fields[payload.name],
          value: payload.value,
        },
      },
    };
  }

  function handleFocus(state, payload) {
    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: {
          ...state.fields[payload.name],
          focused: true,
          caretPosition: 0,
        },
      },
      activeField: payload.activeField,
    };
  }

  function handleBlur(state, payload) {
    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: {
          ...state.fields[payload.name],
          focused: false,
          caretPosition: 0,
        },
      },
    };
  }

  function handleRegisterKeyboard(state, payload) {
    const { id, ref } = payload;

    return {
      ...state,
      keyboards: {
        ...state.keyboards,
        [id]: ref,
      },
    };
  }

  function handleUnregisterKeyboard(state, payload) {
    const { id } = payload;

    const keyboards = Object.entries(state.keyboards).reduce((acc, keyboard) => {
      const [ keyboardId, keyboardRef ] = keyboard;

      if (keyboardId === id) {
        return acc;
      }

      return { ...acc, [keyboardId]: keyboardRef };
    }, {});

    return { ...state, keyboards };
  }

  const reducer = (state, action) => {
    console.log('action::');
    console.log(action);
    switch (action.type) {
      case KEYBOARD_ACTION_TYPES.REGISTER_ITEM:
        return handleRegisterItem(state, action.payload);
      case KEYBOARD_ACTION_TYPES.UNREGISTER_ITEM:
        return handleUnregisterItem(state, action.payload);
      case KEYBOARD_ACTION_TYPES.PRESS_KEY:
        return handlePressKey(state, action.payload);
      case KEYBOARD_ACTION_TYPES.CHANGE_VALUE:
        return handleChangeValue(state, action.payload);
      case KEYBOARD_ACTION_TYPES.FOCUS:
        return handleFocus(state, action.payload);
      case KEYBOARD_ACTION_TYPES.BLUR:
        return handleBlur(state, action.payload);
      case KEYBOARD_ACTION_TYPES.REGISTER_KEYBOARD:
        return handleRegisterKeyboard(state, action.payload);
      case KEYBOARD_ACTION_TYPES.UNREGISTER_KEYBOARD:
        return handleUnregisterKeyboard(state, action.payload);
      default:
        return state;
    }
  };

  function handleMouseDown(e) {
    console.log('handleMouseDown:::::');
    console.log(e.target);
  }

  const [keyboardState, dispatchKeyboardAction] = React.useReducer(reducer, initialState);

  // React.useEffect(() => {
  //   document.addEventListener('mousedown', handleMouseDown);

  //   return () => {
  //     document.removeEventListener('mousedown', handleMouseDown);
  //   };
  // }, []);

  return {
    keyboardState,
    dispatchKeyboardAction,
  };
}

export default useKeyboard;
