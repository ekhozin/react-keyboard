import React from 'react';
import PropTypes from 'prop-types';
import { FormContext } from './FormContext';

function Form(props) {
  const { render, onSubmit } = props;
  const formStore = React.useContext(FormContext);
  const { actions, formState, validateForm } = formStore;

  const renderProps = {
    submitForm: () => {
      const errors = validateForm();

      if (errors) {
        return;
      }

      onSubmit(formState.values);
      actions.submitForm();
    },
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

