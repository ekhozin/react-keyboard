import React from 'react';
import PropTypes from 'prop-types';
import { FormContext } from './FormContext';

function Form(props) {
  const { render, onSubmit, validateOnBlur } = props;
  const formStore = React.useContext(FormContext);
  const { actions, formState, validateForm } = formStore;

  React.useEffect(() => {
    actions.initializeForm({ validateOnBlur });

    return () => {
      actions.resetFormState();
    };
  }, []);

  const renderProps = {
    submitForm: () => {
      const errors = validateForm();

      if (errors) {
        return;
      }

      onSubmit(
        formState.values,
        {
          submitFormStart: actions.submitFormStart,
          submitFormStop: actions.submitFormStop,
          setErrors: actions.setErrors,
          setInitialValues: actions.setInitialValues,
          resetErrors: actions.resetErrors,
        }
      );
    },
    submitting: formState.submitting,
    formSubmitError: formState.formSubmitError,
  };

  return render(renderProps);
}

Form.propTypes = {
  render: PropTypes.func.isRequired,
  onSumbit: PropTypes.func,
  validateOnBlur: PropTypes.bool,
};

Form.defaultProps = {
  onSumbit: () => {},
  validateOnBlur: true,
};

export { Form };

