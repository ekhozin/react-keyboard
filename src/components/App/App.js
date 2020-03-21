import React from 'react';

import Keyboard, { KeyboardContext, useKeyboard } from 'components/Keyboard';
import KeyboardForm from 'components/KeyboardForm';

function App() {
  const initialKeyboard = useKeyboard();

  return (
    <KeyboardContext.Provider value={initialKeyboard}>
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
