import React from 'react';
import PropTypes from 'prop-types';
import { FormContext } from './FormContext';

function Form(props) {
  const { render, onSubmit } = props;
  const { actions } = React.useContext(FormContext);

  const renderProps = {
    submitForm: () => actions.submitForm(onSubmit),
  };

  return render(renderProps);
}

Form.propTypes = {
  render: PropTypes.func.isRequired,
  onSumbit: PropTypes.func,
};

Form.defaultProps = {
  onSumbit: () => {},
};

export { Form };

