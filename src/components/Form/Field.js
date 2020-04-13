import React from 'react';
import PropTypes from 'prop-types';
import { KEYBOARD_ACTION_TYPES, KeyboardContext } from 'components/Keyboard';

function Field(props) {
  const { dispatchKeyboardAction, keyboardState } = React.useContext(KeyboardContext);
  const { render, name, initialValue } = props;

  React.useEffect(() => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.REGISTER_ITEM,
      payload: { name, value: initialValue },
    });

    return () => {
      dispatchKeyboardAction({
        type: KEYBOARD_ACTION_TYPES.UNREGISTER_ITEM,
        payload: { name },
      });
    };
  }, []);

  const handleChange = (value) => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.CHANGE_VALUE,
      payload: { name, value },
    });
  };

  const handleFocus = (e) => {
    const event = e;
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.FOCUS,
      payload: { name, activeField: event.target },
    });
  };

  const handleBlur = () => {
    dispatchKeyboardAction({
      type: KEYBOARD_ACTION_TYPES.BLUR,
      payload: { name },
    });
  };

  const value = keyboardState.fields[name] ? keyboardState.fields[name].value : initialValue;

  const renderProps = {
    handleChange,
    handleFocus,
    handleBlur,
    value,
    name,
  };

  return render(renderProps);
}

Field.propTypes = {
  render: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.any,
};

export { Field };
