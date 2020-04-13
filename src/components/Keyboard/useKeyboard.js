import React from 'react';
import { KEYBOARD_ACTION_TYPES } from './actionTypes';

function getInputSelection(el) {
  let start = 0; let end = 0; let normalizedValue; let range;
  let textInputRange; let len; let endRange;

  if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() === el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, '\n');

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart('character', -len);
        start += normalizedValue.slice(0, start).split('\n').length - 1;

        if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd('character', -len);
          end += normalizedValue.slice(0, end).split('\n').length - 1;
        }
      }
    }
  }

  return {
    start,
    end,
  };
}

function offsetToRangeCharacterMove(el, offset) {
  return offset - (el.value.slice(0, offset).split('\r\n').length - 1);
}

function setInputSelection(el, startOffset, endOffset) {
  if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
    el.selectionStart = startOffset;
    el.selectionEnd = endOffset;
  } else {
    let range = el.createTextRange();
    let startCharMove = offsetToRangeCharacterMove(el, startOffset);
    range.collapse(true);
    if (startOffset === endOffset) {
      range.move('character', startCharMove);
    } else {
      range.moveEnd('character', offsetToRangeCharacterMove(el, endOffset));
      range.moveStart('character', startCharMove);
    }
    range.select();
  }
}

function useKeyboard() {
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
    // TODO: 1) handle caret position
    // TODO: 2) handle key types
    // console.log('handlePressKey::');
    // console.log(state.activeField.target.selectionStart);
    const fields = Object.entries(state.fields).reduce((acc, item) => {
      const [name, params] = item;

      if (!params.focused) {
        return acc;
      }

      const activeElement = document.activeElement;
      const sel = getInputSelection(activeElement);
      console.log(sel);
      const newValue = params.value.slice(0, sel.start) + payload.keyCode + params.value.slice(sel.end);
      // TODO: why does not work?
      setInputSelection(activeElement, sel.start + 1, sel.end + 1);

      return {
        ...acc,
        [name]: {
          ...params,
          value: newValue,
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
    // console.log('action::');
    // console.log(action);

    // console.log('state::');
    // console.log(state.activeField);
    // console.log(document.activeElement.selectionStart);
    // console.count('===================================');
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
