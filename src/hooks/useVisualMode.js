import {useState} from 'react';

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (mode, replace = false) => {
    if (replace){
      setHistory(history.pop());
    } 
    setMode(mode);
    setHistory([...history,mode]);
  };
  
  const back = () => {
    if (mode !== initial) {
      history.pop();
      setMode(history[history.length-1]);
    }
  }

  return { mode, transition, back };
}

export default useVisualMode;