import React from 'react';
import { useForm } from 'components/Form';
import { useKeyboard } from 'components/Keyboard';

function useFormWithKeyboard() {
  const activeField = React.useRef(null);

  const { formState, actions: formActions, ...restStoreData } = useForm();
  const handlePressKey = useKeyboard();

  const blurFieldAction = formActions.blurField;
  const focusFieldAction = formActions.focusField;
  const changeFieldValueAction = formActions.changeFieldValue;

  const focusField = (name, activeElement) => {
    activeField.current = activeElement;
    focusFieldAction(name);
  };

  const blurField = (name) => {
    activeField.current = null;
    blurFieldAction(name);
  };

  const pressKey = (keyCode) => {
    const focusedFieldName = Object.entries(formState.fields).reduce(
      (result, [fieldName, { focused }]) => focused ? fieldName : result,
      undefined
    );

    if (!focusedFieldName) {
      return;
    }

    const value = formState.values[focusedFieldName];
    const newValue = handlePressKey(keyCode, value, activeField.current);
    changeFieldValueAction(focusedFieldName, newValue);
  };

  const actions = {
    ...formActions,
    focusField,
    blurField,
    pressKey,
  };

  return { formState, actions, ...restStoreData };
}

export { useFormWithKeyboard };
