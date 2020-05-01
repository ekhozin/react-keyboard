import React from 'react';
import { omit } from './tools';

const ACTION_TYPES = {
  REGISTER_FIELD: 'REGISTER_FIELD',
  UNREGISTER_FIELD: 'UNREGISTER_FIELD',
  PRESS_KEY: 'PRESS_KEY',
  CHANGE_VALUE: 'CHANGE_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  SUBMIT_FORM_START: 'SUBMIT_FORM_START',
  SUBMIT_FORM_STOP: 'SUBMIT_FORM_STOP',
  SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
  INITIALIZE_FORM: 'INITIALIZE_FORM',
  RESET_FORM_STATE: 'RESET_FORM_STATE',
  RESET_ERRORS: 'RESET_ERRORS',
  SET_INITIAL_VALUES: 'SET_INITIAL_VALUES',
};

function useForm() {
  const initialState = {
    registeredFields: [],
    values: {},
    errors: {},
    changed: {},
    initialValues: {},
    validators: {},
    focusedField: '',
    submitting: false,
    formSubmitError: null,
    validateOnBlur: true,
  };

  function reducerRegisterField(state, payload) {
    if (state.registeredFields.includes(payload.name)) {
      console.error(`A field with the name "${payload.name}" has already been declarated. Choose other name.`);
      return state;
    }

    const validators =
      typeof payload.validator === 'function' ?
        { ...state.validators, [payload.name]: payload.validator } : state.validators;

    return {
      ...state,
      validators,
      initialValues: { ...state.initialValues, [payload.name]: payload.value },
      changed: { ...state.changed, [payload.name]: false },
      values: { ...state.values, [payload.name]: payload.value },
      errors: { ...state.errors, [payload.name]: null },
      registeredFields: [...state.registeredFields, payload.name],
    };
  }

  function reducerUnregisterField(state, payload) {
    return {
      ...state,
      registeredFields: state.registeredFields.filter((field) => field !== payload.name),
      errors: omit(state.errors, payload.name),
      values: omit(state.values, payload.name),
      changed: omit(state.changed, payload.name),
      focusedField: state.focusedField === payload.name ? '' : state.focusedField,
      validators: omit(state.validators, payload.name),
    };
  }

  function reducerChangeValue(state, payload) {
    return {
      ...state,
      values: { ...state.values, [payload.name]: payload.value },
      changed: { ...state.changed, [payload.name]: true },
      errors: state.registeredFields.reduce((acc, fieldName) => {
        if (payload.name === fieldName && state.validators[fieldName]) {
          return {
            ...acc,
            [fieldName]: state.validateOnBlur ?
              null : state.validators[fieldName](state.values[fieldName], state.values),
          };
        }

        return acc;
      }, state.errors),
    };
  }

  function reducerFocus(state, payload) {
    return { ...state, focusedField: payload.name };
  }

  function reducerBlur(state, payload) {
    let newErrors = state.errors;

    if (state.validateOnBlur && state.changed[payload.name] && state.validators[payload.name]) {
      newErrors = state.registeredFields.reduce(
        (acc, fieldName) =>
          payload.name === fieldName ?
            { ...acc, [fieldName]: state.validators[fieldName](state.values[fieldName], state.values) } : acc,
        state.errors,
      );
    }

    return { ...state, focusedField: '', errors: newErrors };
  }

  function reducerSubmitFormStart(state) {
    return { ...state, submitting: true };
  }

  function reducerSubmitFormStop(state) {
    return { ...state, submitting: false };
  }

  function reducersetErrors(state, payload) {
    const { _FORM = null, ...fieldErrors } = payload.errors;

    return {
      ...state,
      errors: { ...state.errors, ...fieldErrors },
      formSubmitError: _FORM,
    };
  }

  function reducerInitializeForm(state, payload) {
    return { ...state, validateOnBlur: payload.validateOnBlur };
  }

  function reducerResetFormState() {
    return initialState;
  }

  // TODO: refactor
  function reducerResetErrors(state, payload) {
    const { fieldNames } = payload;

    const handler = fieldNames.length ?
      ((acc, fieldName) => fieldNames.includes(fieldName) ? { ...acc, [fieldName]: null } : acc) :
      ((acc, fieldName) => ({ ...acc, [fieldName]: null }));

    return {
      ...state,
      errors: fieldNames.reduce(handler, state.errors),
    };
  }

  function reducerSetInitialValues(state) {
    const values = state.registeredFields.reduce(
      (acc, fieldName) => ({ ...acc, [fieldName]: state.initialValues[fieldName] }),
      {},
    );

    return {
      ...state,
      values,
    };
  }

  /**
   * REDUCER.
   * @param {Object} state
   * @param {Object} action
   */
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
      case ACTION_TYPES.SUBMIT_FORM_START:
        return reducerSubmitFormStart(state);
      case ACTION_TYPES.SUBMIT_FORM_STOP:
        return reducerSubmitFormStop(state);
      case ACTION_TYPES.SET_VALIDATION_ERRORS:
        return reducersetErrors(state, action.payload);
      case ACTION_TYPES.INITIALIZE_FORM:
        return reducerInitializeForm(state, action.payload);
      case ACTION_TYPES.RESET_FORM_STATE:
        return reducerResetFormState();
      case ACTION_TYPES.RESET_ERRORS:
        return reducerResetErrors(state, action.payload);
      case ACTION_TYPES.SET_INITIAL_VALUES:
        return reducerSetInitialValues(state);
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

  const submitFormStart = () => {
    dispatchFormAction({
      type: ACTION_TYPES.SUBMIT_FORM_START,
    });
  };

  const submitFormStop = () => {
    dispatchFormAction({
      type: ACTION_TYPES.SUBMIT_FORM_STOP,
    });
  };

  const setErrors = (errors) => {
    dispatchFormAction({
      type: ACTION_TYPES.SET_VALIDATION_ERRORS,
      payload: { errors },
    });
  };

  const initializeForm = (params) => {
    dispatchFormAction({
      type: ACTION_TYPES.INITIALIZE_FORM,
      payload: params,
    });
  };

  const resetFormState = () => {
    dispatchFormAction({
      type: ACTION_TYPES.RESET_FORM_STATE,
    });
  };

  const resetErrors = (fieldNames = []) => {
    dispatchFormAction({
      type: ACTION_TYPES.RESET_ERRORS,
      payload: { fieldNames },
    });
  };

  const setInitialValues = () => {
    dispatchFormAction({
      type: ACTION_TYPES.SET_INITIAL_VALUES,
    });
  };

  const actions = {
    registerField,
    unregisterField,
    changeFieldValue,
    focusField,
    blurField,
    submitFormStart,
    submitFormStop,
    setErrors,
    initializeForm,
    resetFormState,
    resetErrors,
    setInitialValues,
  };

  /**
   * HELPERS
   */
  function validateForm() {
    let hasErrors = false;

    const errors = formState.registeredFields.reduce((acc, fieldName) => {
      const fieldValue = formState.values[fieldName];
      const fieldValidator = formState.validators[fieldName];

      if (!fieldValidator) {
        return acc;
      }

      const error = fieldValidator(fieldValue);
      hasErrors = error !== null;

      return { ...acc, [fieldName]: error };
    }, formState.errors);

    if (hasErrors) {
      setErrors(errors);
      return errors;
    }

    return;
  }

  return { formState, actions, validateForm };
}

export { useForm, ACTION_TYPES };
