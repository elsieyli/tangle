import React, { useState, useEffect } from "react";

interface TypingButtonProps {
  text: string; // Accept text as a prop
  typingSpeed?: number; // Optionally allow control over typing speed
  onClick?: () => void; // Accept an onClick function prop
}

const TypingButton: React.FC<TypingButtonProps> = ({ text, typingSpeed = 100, onClick }) => {
  const [displayedText, setDisplayedText] = useState<string>(""); // State to store the current text being typed

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + 1)); // Update the displayedText with slicing
      currentIndex++;

      if (currentIndex === text.length) {
        clearInterval(interval); // Clear the interval when the full text is displayed
      }
    }, typingSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [text, typingSpeed]); // Add text and typingSpeed as dependencies

  return (
    <div className="home-container">
      <button
        className="text-center px-6 py-3 text-lg font-medium text-white bg-black/75 rounded-md hover:bg-white/75 hover:text-black transition-colors"
        onClick={onClick} // Trigger the onClick handler passed as a prop
      >
        {displayedText || " "} {/* Show typed text or a space initially */}
      </button>
    </div>
  );
};

export default TypingButton;
