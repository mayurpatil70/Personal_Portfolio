import { useState, useEffect } from "react";

interface UseTypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
}

export const useTypeWriter = ({ text, speed = 50, delay = 0 }: UseTypeWriterProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    const startTyping = () => {
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.substring(0, charIndex + 1));
          charIndex++;
        } else {
          setIsComplete(true);
          clearInterval(typeInterval);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => clearTimeout(delayTimeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};
