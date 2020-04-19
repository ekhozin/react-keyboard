import React from 'react';

import { KeyboardWithContext, KeyboardContext } from 'components/Keyboard';
import { useFormWithKeyboard } from 'hooks';
import { KeyboardForm } from 'components/KeyboardForm';

function App() {
  const formWithKeyboard = useFormWithKeyboard();

  return (
    <KeyboardContext.Provider value={formWithKeyboard}>
      <div>
        <h1>Keyboard!!!</h1>
        <KeyboardForm/>
        <br/>
        <hr/>
        <br/>
        <KeyboardWithContext/>
      </div>
    </KeyboardContext.Provider>
  );
}

export default App;
