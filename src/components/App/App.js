import React from 'react';

import { Keyboard, KeyboardContext } from 'components/Keyboard';
import { useFormWithKeyboard } from 'components/Keyboard/useFormWithKeyboard';
import KeyboardForm from 'components/KeyboardForm';

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
        <Keyboard id='general-keyboard'/>
      </div>
    </KeyboardContext.Provider>
  );
}

export default App;
