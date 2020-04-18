import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardContext } from 'components/Keyboard';

function Field(props) {
  const childRef = React.createRef();
  const { actions, formState } = React.useContext(KeyboardContext);
  const { render, name, initialValue } = props;

  React.useEffect(() => {
    actions.registerField(name, initialValue);

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

  const value = formState.fields[name] ? formState.fields[name].value : initialValue;

  const renderProps = {
    handleChange,
    handleFocus,
    handleBlur,
    value,
    name,
    setRef,
  };

  return render(renderProps);
}

Field.propTypes = {
  render: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.any,
};

export { Field };
