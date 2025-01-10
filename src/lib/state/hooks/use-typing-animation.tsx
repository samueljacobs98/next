import { useEffect, useState } from "react";

export function useTypingAnimation(text: string, duration: number = 200) {
  const [displayedText, setDisplayedText] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    const typingEffectInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffectInterval);
      }
    }, duration);

    return () => clearInterval(typingEffectInterval);
  }, [text, duration, i]);

  return displayedText;
}
