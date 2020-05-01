import React from 'react';
import PropTypes from 'prop-types';

import { Field, Form } from 'components/Form';
import { composeValidators, createValidateRequired, createValidateMaxLength } from 'tools';

const MAX_COMMENT_LENGTH = 5;

function ErrorMessage({ children }) {
  return <div style={{ color: 'red' }}>{children}</div>;
}

ErrorMessage.propTypes = {
  children: PropTypes.any,
};

const apiRequest = (values, isError = false) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (isError) {
      reject({ name: 'Invalid name' });
    }

    resolve(values);
  }, 1000);
});

function KeyboardForm() {
  const validateName = createValidateRequired();
  const validateMessage = composeValidators(createValidateRequired(), createValidateMaxLength(MAX_COMMENT_LENGTH));

  const handleSubmit = (values) => apiRequest(values, false)
    .then((values) => {
      console.log('Submit success: ', values);
    })
    .catch((error) => {
      console.log('Error', error);
    });


  return (
    <Form
      onSubmit={handleSubmit}
      render={(formProps) => {
        const { submitForm } = formProps;

        return (
          <>
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
            <div>
              <button onClick={submitForm}>Submit</button>
            </div>
          </>
        );
      }}
    />
  );
}

export { KeyboardForm };
