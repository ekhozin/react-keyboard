import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'components/Form';
import { composeValidators, createValidateRequired, createValidateMaxLength } from 'tools';

const MAX_COMMENT_LENGTH = 5;

function ErrorMessage({ children }) {
  return <div style={{ color: 'red' }}>{children}</div>;
}

ErrorMessage.propTypes = {
  children: PropTypes.any,
};

function KeyboardForm() {
  const validateName = createValidateRequired();
  const validateMessage = composeValidators(createValidateRequired(), createValidateMaxLength(MAX_COMMENT_LENGTH));

  return (
    <div>
      <div>
        <Field
          initialValue=''
          name='name'
          validator={validateName}
          render={(renderProps) => {
            const { handleFocus, handleChange, handleBlur, name, value, error, setRef } = renderProps;

            return (
              <div>
                <input
                  ref={setRef}
                  autoComplete='off'
                  placeholder='your name'
                  name={name}
                  value={value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </div>
            );
          }}
        />
      </div>
      <div>
        <Field
          initialValue=''
          name='comment'
          validator={validateMessage}
          render={(renderProps) => {
            const { handleFocus, handleChange, handleBlur, name, value, error, setRef } = renderProps;

            return (
              <div>
                <textarea
                  ref={setRef}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  autoComplete='off'
                  placeholder='comment'
                  name={name}
                  value={value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

export { KeyboardForm };
