import React from 'react';

import { Field } from 'components/Form';

function KeyboardForm() {
  return (
    <div>
      <div>
        <Field
          initialValue=''
          name='name'
          render={(renderProps) => {
            const { handleFocus, handleChange, handleBlur, name, value } = renderProps;

            return (
              <input
                autoComplete='off'
                placeholder='your name'
                name={name}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
              />
            );
          }}
        />
      </div>
      <div>
        <Field
          initialValue=''
          name='surname'
          render={(renderProps) => {
            const { handleFocus, handleChange, handleBlur, name, value } = renderProps;

            return (
              <textarea
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
            );
          }}
        />
      </div>
    </div>
  );
}

export default KeyboardForm;
