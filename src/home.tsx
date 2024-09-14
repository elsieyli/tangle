import React from "react";
import TypingButton from "./typingButton"; // Import TypingButton component

const Home: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#150429]">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
