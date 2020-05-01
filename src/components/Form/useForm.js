import React from 'react';

const ACTION_TYPES = {
  REGISTER_FIELD: 'REGISTER_FIELD',
  UNREGISTER_FIELD: 'UNREGISTER_FIELD',
  PRESS_KEY: 'PRESS_KEY',
  CHANGE_VALUE: 'CHANGE_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  SUBMIT: 'SUBMIT',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_ERROR: 'SUBMIT_ERROR',
  SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
};

function useForm() {
  const initialState = {
    fields: {},
    values: {},
    errors: {},
    registeredFields: [],
    submitting: false,
    formSubmitError: null,
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
          validator: payload.validator,
          validateOnBlur: payload.validateOnBlur,
        },
      },
      values: { ...state.values, [payload.name]: payload.value },
      registeredFields: [...state.registeredFields, payload.name],
      errors: { ...state.errors, [payload.name]: null },
    };
  }

  // TODO: remove all info about field
  function reducerUnregisterField(state, payload) {
    const fields = Object.entries(state.fields).reduce((acc, item) => {
      const [name, params] = item;

      if (name === payload.name) {
        return acc;
      }

      return { ...acc, [name]: params };
    }, {});

    const registeredFields = registeredFields.filter((field) => field !== payload.name);

    const errors = registeredFields.reduce(
      (acc, fieldName) => fieldName === payload.name ? acc : { ...acc, [fieldName]: state.errors[fieldName] },
      {},
    );

    const values = registeredFields.reduce(
      (acc, fieldName) => fieldName === payload.name ? acc : { ...acc, [fieldName]: state.values[fieldName] },
      {},
    );

    return { ...state, fields, registeredFields, errors, values };
  }

  function reducerChangeValue(state, payload) {
    const field = state.fields[payload.name];

    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: { ...field, changed: true },
      },
      values: {
        ...state.values,
        [payload.name]: payload.value,
      },
      errors: state.registeredFields.reduce((acc, fieldName) => {
        if (payload.name === fieldName) {
          return {
            ...acc,
            [fieldName]: field.validateOnBlur ? null : field.validator(state.values[payload.name], state.values),
          };
        }

        return acc;
      }, state.errors),
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
    let newErrors = state.errors;

    if (field.validateOnBlur && field.changed) {
      newErrors = state.registeredFields.reduce((acc, fieldName) => {
        if (payload.name === fieldName) {
          return { ...acc, [fieldName]: field.validator(state.values[fieldName], state.values) };
        }

        return acc;
      }, state.errors);
    }

    return {
      ...state,
      fields: {
        ...state.fields,
        [payload.name]: newField,
      },
      errors: newErrors,
    };
  }

  // TODO: is it needed?
  function reducerSubmitForm(state) {
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
      return {
        ...state,
        fields: Object.entries(state.fields).reducer((acc, entry) => {
          const [fieldName, fieldData] = entry;
          acc[fieldName] = { ...fieldData, error: null, changed: false };

          return acc;
        }, {}),
      };
    }

    return { ...state, submitting: true, fields };
  }
  // TODO: is it needed?
  function reducerSubmitSuccess(state) {
    return { ...state, submitting: false };
  }
  // TODO: is it needed?
  function reducerSubmitError(state, payload) {
    const { errors } = payload;
    const { _FORM = null, ...restErrors } = errors;

    const fields = Object.entries(state.fields).reducer((acc, entry) => {
      const [fieldName, fieldData] = entry;

      if (restErrors[fieldName]) {
        acc[fieldName] = { ...fieldData, error: restErrors[fieldName] };
      }

      return acc;
    }, {});

    return { ...state, fields, submitting: false, formSubmitError: _FORM };
  }

  function reducerSetValidationErrors(state, payload) {
    return {
      ...state,
      errors: { ...state.errors, ...payload.errors },
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
      case ACTION_TYPES.SUBMIT:
        return reducerSubmitForm(state);
      case ACTION_TYPES.SUBMIT_SUCCESS:
        return reducerSubmitSuccess(state);
      case ACTION_TYPES.SUBMIT_ERROR:
        return reducerSubmitError(state, action.payload);
      case ACTION_TYPES.SET_VALIDATION_ERRORS:
        return reducerSetValidationErrors(state, action.payload);
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

  const submitForm = () => {
    dispatchFormAction({
      type: ACTION_TYPES.SUBMIT,
    });
  };

  const submitSuccess = () => {
    dispatchFormAction({
      type: ACTION_TYPES.SUBMIT_SUCCESS,
    });
  };

  const submitError = () => {
    dispatchFormAction({
      type: ACTION_TYPES.SUBMIT_ERROR,
    });
  };

  const setValidationErrors = (errors) => {
    dispatchFormAction({
      type: ACTION_TYPES.SET_VALIDATION_ERRORS,
      payload: { errors },
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
    submitSuccess,
    submitError,
    setValidationErrors,
  };

  /**
   * HELPERS
   */
  function validateForm() {
    const errors = formState.registeredFields.reduce((acc, fieldName) => {
      const fieldValue = formState.values[fieldName];
      const fieldValidator = formState.fields[fieldName].validator;

      acc[fieldName] = fieldValidator(fieldValue);

      return acc;
    }, {});

    if (Object.values(errors).some((err) => err !== null)) {
      setValidationErrors(errors);
      return errors;
    }

    return;
  }

  return { formState, actions, validateForm };
}

export { useForm, ACTION_TYPES };
