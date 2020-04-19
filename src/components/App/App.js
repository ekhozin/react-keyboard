import React from 'react';

import { KeyboardWithContext } from 'components/Keyboard';
import { FormContext } from 'components/Form';
import { useFormWithKeyboard } from 'hooks';
import { KeyboardForm } from 'components/KeyboardForm';

function App() {
  const formWithKeyboard = useFormWithKeyboard();

  return (
    <FormContext.Provider value={formWithKeyboard}>
      <div>
        <h1>Keyboard!!!</h1>
        <KeyboardForm/>
        <br/>
        <hr/>
        <br/>
        <KeyboardWithContext/>
      </div>
    </FormContext.Provider>
  );
}

export default App;
