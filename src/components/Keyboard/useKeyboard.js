import { useRunAfterUpdate } from './useRunAfterUpdate';
import { SelectionManager } from './selectionManager';

function useKeyboard() {
  const { getInputSelection, setInputSelection } = new SelectionManager();
  const runAfterUpdate = useRunAfterUpdate();

  return function (keyCode, value, htmlElement) {

    if (!htmlElement) {
      return value;
    }

    const selection = getInputSelection(htmlElement);

    const newValue = value.slice(0, selection.start) + keyCode + value.slice(selection.end);

    runAfterUpdate(() => {
      setInputSelection(htmlElement, selection.start + 1, selection.end + 1);
    });

    return newValue;
  };
}

export { useKeyboard };
