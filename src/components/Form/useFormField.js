import React from 'react';
import { FormContext } from './FormContext';

function useFormField(fieldProps) {
  const { initialValue, name, validator, validateOnBlur = true } = fieldProps;
  const childRef = React.createRef();
  const { actions, formState } = React.useContext(FormContext);
  const isRegistered = formState.registeredFields.includes(name);

  React.useEffect(() => {
    actions.registerField({
      name,
      value: initialValue,
      validateOnBlur,
      validator,
    });

    return () => {
      actions.unregisterField(name);
    };
  }, []);

  const setRef = (renderNode) => {
    childRef.current = renderNode;
  };

  const handleChange = (value) => {
    actions.changeFieldValue(name, value);
  };

  const handleFocus = () => {
    actions.focusField(name, childRef.current);
  };

  const handleBlur = () => {
    actions.blurField(name);
  };

  return {
    handleChange,
    handleFocus,
    handleBlur,
    setRef,
    value: isRegistered ? formState.values[name] : initialValue,
    error: isRegistered ? formState.errors[name] : null,
    focused: isRegistered ? formState.fields[name].focused : false,
    changed:  isRegistered ? formState.fields[name].changed : false,
  };
}

export { useFormField };
