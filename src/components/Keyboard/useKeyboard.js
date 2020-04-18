import React from 'react';
import { KEYBOARD_ACTION_TYPES } from './actionTypes';
import { useRunAfterUpdate } from './useRunAfterUpdate';
import { SelectionManager } from './selectionManager';

function useKeyboard() {
  const { getInputSelection, setInputSelection } = new SelectionManager();
  const runAfterUpdate = useRunAfterUpdate();

  const initialState = {
    fields: {},
    activeField: null,
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
    const activeElement = state.activeField;

    if (!activeElement) {
      return state;
    }

    const selection = getInputSelection(activeElement);

    const fields = Object.entries(state.fields).reduce((acc, item) => {
      const [name, params] = item;

      if (!params.focused) {
        return acc;
      }

      const newValue = params.value.slice(0, selection.start) + payload.keyCode + params.value.slice(selection.end);

      return {
        ...acc,
        [name]: {
          ...params,
          value: newValue,
        },
      };
    }, state.fields);

    runAfterUpdate(() => {
      setInputSelection(activeElement, selection.start + 1, selection.end + 1);
    });

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
        },
      },
      activeField: null,
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

  const [keyboardState, dispatchKeyboardAction] = React.useReducer(reducer, initialState);

  return {
    keyboardState,
    dispatchKeyboardAction,
  };
}

export default useKeyboard;
