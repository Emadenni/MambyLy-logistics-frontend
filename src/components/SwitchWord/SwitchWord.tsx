import { useState, useEffect } from "react";
import OriginalTextTransition, { presets } from "react-text-transition";
import "./switchWord.scss";

interface SwitchWordProps {
  words: string[];
  interval?: number;
}

const SwitchWord: React.FC<SwitchWordProps> = ({ words, interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <OriginalTextTransition springConfig={presets.gentle}>
      <span className="highlighted">
        {words[index]}
      </span>
    </OriginalTextTransition>
  );
};

export default SwitchWord;