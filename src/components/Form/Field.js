import PropTypes from 'prop-types';
import { useFormField } from './useFormField';

function Field(props) {
  const { render, name, initialValue, validator } = props;
  const {
    handleChange,
    handleFocus,
    handleBlur,
    setRef,
    value,
    error,
  } = useFormField({ name, initialValue, validator });

  const renderProps = {
    handleChange,
    handleFocus,
    handleBlur,
    value,
    error,
    name,
    setRef,
  };

  return render(renderProps);
}

Field.propTypes = {
  render: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.any,
  validator: PropTypes.func,
};

Field.defaultProps = {
  validator: () => null,
};

export { Field };
