import React from "react";
import TypingButton from "./typingButton"; // Import TypingButton component

const Home: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#150429]">

      {/* Half Transparent Centered Image */}
      <img
        src="/icon.PNG" // Using the image from the public folder
        alt="Centered Icon"
        className="absolute w-1/2 h-auto opacity-50 z-[-1] mx-auto my-auto top-0 bottom-0 left-0 right-0"
      />

      {/* Main content */}
      <main className="text-center mt-20 z-10">
        <h1 className="text-9xl font-cursive text-white">Tangle</h1>
        <p className="text-2xl text-gray-500 mt-10">Connect The North</p>

        {/* Buttons */}
        <div className="mt-10">
          {/* Replace the current button with TypingButton */}
          <TypingButton />
        </div>
      </main>
    </div>
  );
};

export default Home;
