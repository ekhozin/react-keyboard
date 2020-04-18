import React from 'react';

const ACTION_TYPES = {
  REGISTER_FIELD: 'REGISTER_FIELD',
  UNREGISTER_FIELD: 'UNREGISTER_FIELD',
  PRESS_KEY: 'PRESS_KEY',
  CHANGE_VALUE: 'CHANGE_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
};

function useForm() {
  const initialState = {
    fields: {},
  };

  function reducerRegisterField(state, payload) {
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

  function reducerUnregisterField(state, payload) {
    const fields = Object.entries(state.fields).reduce((acc, item) => {
      const [name, params] = item;

      if (name === payload.name) {
        return acc;
      }

      return { ...acc, [name]: params };
    }, {});

    return { ...state, fields };
  }

  function reducerChangeValue(state, payload) {
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

  function reducerFocus(state, payload) {
    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: {
          ...state.fields[payload.name],
          focused: true,
        },
      },
    };
  }

  function reducerBlur(state, payload) {
    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: {
          ...state.fields[payload.name],
          focused: false,
        },
      },
    };
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTION_TYPES.REGISTER_FIELD:
        return reducerRegisterField(state, action.payload);
      case ACTION_TYPES.UNREGISTER_FIELD:
        return reducerUnregisterField(state, action.payload);
      case ACTION_TYPES.CHANGE_VALUE:
        return reducerChangeValue(state, action.payload);
      case ACTION_TYPES.FOCUS:
        return reducerFocus(state, action.payload);
      case ACTION_TYPES.BLUR:
        return reducerBlur(state, action.payload);
      default:
        return state;
    }
  };

  const [formState, dispatchFormAction] = React.useReducer(reducer, initialState);

  const registerField = (name, value) =>
    dispatchFormAction({
      type: ACTION_TYPES.REGISTER_FIELD,
      payload: { name, value },
    });

  const unregisterField = (name) =>
    dispatchFormAction({
      type: ACTION_TYPES.UNREGISTER_ITEM,
      payload: { name },
    });

  const changeFieldValue = (name, value) =>
    dispatchFormAction({
      type: ACTION_TYPES.CHANGE_VALUE,
      payload: { name, value },
    });

  const focusField = (name) => {
    dispatchFormAction({
      type: ACTION_TYPES.FOCUS,
      payload: { name },
    });
  };

  const blurField = (name) => {
    dispatchFormAction({
      type: ACTION_TYPES.BLUR,
      payload: { name },
    });
  };

  const actions = {
    registerField,
    unregisterField,
    changeFieldValue,
    focusField,
    blurField,
  };

  return { formState, actions };
}

export { useForm };
