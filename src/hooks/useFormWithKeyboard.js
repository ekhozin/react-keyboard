import React from 'react';
import { useForm } from 'components/Form';
import { useKeyboard } from 'components/Keyboard';

function useFormWithKeyboard() {
  const activeField = React.useRef(null);

  const { formState, actions: formActions } = useForm();
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
    const focusedField = Object.entries(formState.fields).find(([, { focused }]) => focused);

    if (typeof focusedField === 'undefined') {
      return;
    }

    const [name, { value }] = focusedField;
    const newValue = handlePressKey(keyCode, value, activeField.current);
    changeFieldValueAction(name, newValue);
  };

  const actions = {
    ...formActions,
    focusField,
    blurField,
    pressKey,
  };

  return { formState, actions };
}

export { useFormWithKeyboard };
