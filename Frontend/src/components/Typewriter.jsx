import React, { useState, useEffect } from 'react';

export function Typewriter({ words, speed = 80, delay = 1800, deleteSpeed = 40 }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const activeWord = words[currentWordIndex];

    if (!isDeleting) {
      // Typing phase
      if (currentText !== activeWord) {
        timer = setTimeout(() => {
          setCurrentText(activeWord.slice(0, currentText.length + 1));
        }, speed);
      } else {
        // Pause after full word is typed
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    } else {
      // Deleting phase
      if (currentText !== '') {
        timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay, deleteSpeed]);

  return (
    <span className="typewriter-container">
      {currentText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
