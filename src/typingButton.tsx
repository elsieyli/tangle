import React, { useState, useEffect } from "react";

const Home: React.FC = () => {
  const [displayedText, setDisplayedText] = useState<string>(""); // State to store the current text being typed
  const fullText = "Start now"; // The full text to display
  const typingSpeed = 100; // Typing speed in milliseconds

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, currentIndex + 1)); // Update the displayedText with slicing
      currentIndex++;

      if (currentIndex === fullText.length) {
        clearInterval(interval); // Clear the interval when the full text is displayed
      }
    }, typingSpeed);

    // Cleanup in case the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="home-container">
      <button className="text-center px-6 py-3 text-lg font-medium text-white bg-black rounded-md hover:bg-white hover:text-black transition-colors">
        {displayedText || " "} {/* Show typed text or a space initially */}
      </button>
    </div>
  );
};

export default Home;
