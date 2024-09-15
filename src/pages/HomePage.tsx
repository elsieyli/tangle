import React, { useEffect } from "react";
import TypingButton from "../components/TypingButton";
import { Link } from "react-router-dom";
import Constellation from "../constellation"; // Import the constellation class

const HomePage: React.FC = () => {
  // useEffect(() => {
  //   const canvas = document.getElementById("constellationel") as HTMLCanvasElement;
  //   let constellationInstance: Constellation | null = null;

  //   if (canvas) {
  //     // Initialize the constellation effect
  //     constellationInstance = new Constellation(canvas);
  //   }

  //   // Cleanup function to avoid multiple instances
  //   return () => {
  //     if (canvas) {
  //       constellationInstance = null; // Clears the instance
  //     }
  //   };
  // }, []); // Empty dependency array ensures this effect only runs once

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#150429]">
      {/* Constellation Canvas */}
      <canvas
        id="constellationel"
        className="absolute top-0 left-0 w-full h-full z-100"
      ></canvas>

      {/* Half Transparent Centered Image */}
      {/* <img
        src="/icon.PNG"
        alt="Centered Icon"
        className="absolute w-1/2 h-auto opacity-50 z-0 mx-auto my-auto top-0 bottom-0 left-0 right-0"
      /> */}

      {/* Main content */}
      <main className="text-center mt-20 z-10">
        <h1 className="text-9xl font-cursive text-white">Tangle</h1>
        <p className="text-2xl text-gray-500 mt-10">Connect The North</p>

        <div className="mt-10">
          <Link to="/dashboard">
            <TypingButton />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
