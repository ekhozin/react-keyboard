import React from 'react';

const ACTION_TYPES = {
  REGISTER_FIELD: 'REGISTER_FIELD',
  UNREGISTER_FIELD: 'UNREGISTER_FIELD',
  PRESS_KEY: 'PRESS_KEY',
  CHANGE_VALUE: 'CHANGE_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  SUBMIT: 'SUBMIT',
};

function useForm() {
  const initialState = {
    fields: {},
    values: {},
    registeredFields: [],
  };

  function reducerRegisterField(state, payload) {
    if (state.registeredFields.includes(payload.name)) {
      console.error(`A field with the name "${payload.name}" has already been declarated. Choose other name.`);
      return state;
    }

    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: {
          initialValue: payload.value,
          focused: false,
          changed: false,
          error: null,
          validator: payload.validator,
          validateOnBlur: payload.validateOnBlur,
        },
      },
      values: {
        ...state.values,
        [payload.name]: payload.value,
      },
      registeredFields: [...state.registeredFields, payload.name],
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

    const registeredFields = registeredFields.filter((field) => field !== payload.name);

    return { ...state, fields, registeredFields };
  }

  function reducerChangeValue(state, payload) {
    const field = state.fields[payload.name];

    const newField = {
      ...field,
      changed: true,
      error: field.validateOnBlur ? null : field.validator(state.values[payload.name], state.values),
    };

    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: newField,
      },
      values: {
        ...state.values,
        [payload.name]: payload.value,
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
    const field = state.fields[payload.name];
    let newField = { ...field, focused: false };

    if (field.validateOnBlur && field.changed) {
      newField = { ...newField, error: field.validator(state.values[payload.name], state.values) };
    }

    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: newField,
      },
    };
  }

  function reducerSubmitForm(state, payload) {
    let hasErrors = false;

    const fields = Object.entries(state.values).reduce((acc, entry) => {
      const [fieldName, fieldValue] = entry;
      const error = state.fields[fieldName].validator(fieldValue);

      if (error) {
        hasErrors = true;
      }

      acc[fieldName] = {
        ...state.fields[fieldName],
        error,
      };

      return acc;
    }, {});

    if (!hasErrors) {
      payload.onSubmit(state.values);
      return state;
    }

    return { ...state, fields };
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
      case ACTION_TYPES.SUBMIT:
        return reducerSubmitForm(state, action.payload);
      default:
        return state;
    }
  };

  const [formState, dispatchFormAction] = React.useReducer(reducer, initialState);

  const registerField = (payload) =>
    dispatchFormAction({
      type: ACTION_TYPES.REGISTER_FIELD,
      payload,
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

  const setError = (name, error) => {
    dispatchFormAction({
      type: ACTION_TYPES.SET_ERROR,
      payload: { name, error },
    });
  };

  const submitForm = (onSubmit) => {
    dispatchFormAction({
      type: ACTION_TYPES.SUBMIT,
      payload: { onSubmit },
    });
  };

  const actions = {
    registerField,
    unregisterField,
    changeFieldValue,
    focusField,
    blurField,
    setError,
    submitForm,
  };

  return { formState, actions };
}

export { useForm, ACTION_TYPES };
