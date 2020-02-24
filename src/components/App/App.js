import React from 'react';

import Keyboard, { KeyboardContext, useKeyboard } from 'components/Keyboard';
import KeyboardForm from 'components/KeyboardForm';

const initial = {};

function App() {
  const initialKeyboard = useKeyboard(initial);

  return (
    <KeyboardContext.Provider value={initialKeyboard}>
      <div>
        <h1>Keyboard!!!</h1>
        <KeyboardForm/>
        <br/>
        <hr/>
        <br/>
        <Keyboard/>
      </div>
    </KeyboardContext.Provider>
  );
}

export default App;
