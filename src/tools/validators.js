const createValidateRequired = (message = 'Required') => (value) => value.length ? null : message;

const createValidateMaxLength =
    (max = 255, message = 'Length must be less than {max} or equal') =>
      (value) => value.length <= max ? null : message.replace('{max}', max);

export { createValidateRequired, createValidateMaxLength };
