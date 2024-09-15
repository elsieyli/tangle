import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TypingButton from "../components/TypingButton";
import Constellation from "../constellation"; // Import the constellation class

const HomePage: React.FC = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false); // Track whether to show the search bar
  const [name, setName] = useState<string>(""); // Track the input value

  useEffect(() => {
    const canvas = document.getElementById("constellationel") as HTMLCanvasElement;

    if (canvas) {
      // Initialize the constellation effect
      new Constellation(canvas);
    }

    // Cleanup function to avoid multiple instances
    return () => {

    };
  }, []); // Empty dependency array ensures this effect only runs once

  const handleStartClick = () => {
    setShowSearch(true); // Show the search bar and "Go" button after "Start" is pressed
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // Update the name input
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#150429]">
      {/* Constellation Canvas */}
      <canvas
        id="constellationel"
        className="absolute top-0 left-0 w-full h-full z-0"
      ></canvas>

      {/* Main content */}
      <main className="text-center mt-20 z-10">
        <h1 className="text-9xl font-cursive text-white">Tangle</h1>
        <p className="text-2xl text-gray-500 mt-10">Connect The North</p>

        <div className="mt-10">
          {!showSearch ? (
            <TypingButton text="Start now" onClick={handleStartClick} /> // Start button
          ) : (
            <div className="flex justify-center items-center space-x-2">
              {/* Search bar with placeholder "enter your name" */}
              <input
                type="text"
                className="px-4 py-2 text-lg bg-white text-black rounded-l-md focus:outline-none"
                placeholder="Enter Your Name!"
                value={name}
                onChange={handleSearchChange}
              />
              {/* "Go" button */}
              <Link to="/dashboard">
                <button className="px-4 py-2 text-lg bg-black text-white rounded-r-md hover:bg-gray-800">
                  Go
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
