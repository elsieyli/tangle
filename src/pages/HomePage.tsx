import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import TypingButton from "../components/TypingButton"
import Constellation from "../constellation" // Import the constellation class

const HomePage: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById(
      "constellationel"
    ) as HTMLCanvasElement
    if (canvas && window.innerWidth > 768) {
      // Initialize the constellation effect
      new Constellation(canvas)
    }

    // Cleanup function to avoid multiple instances
    return () => {
      // Add cleanup logic here if necessary
    }
  }, []) // Empty dependency array ensures this effect only runs once

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#150429]">
      {/* Constellation Canvas */}
      <canvas
        id="constellationel"
        className="absolute top-0 left-0 w-full h-full z-0"
      ></canvas>

      {/* Main content */}
      <main className="text-center mt-20 z-10">
        <h1 className=" text-5xl md:text-9xl font-cursive text-white">
          Tangle
        </h1>
        <p className="text-2xl text-gray-500 mt-10">Connect The North</p>

        <div className="mt-10">
          <Link to="/dashboard">
            <TypingButton text="Start now" />
          </Link>
        </div>
      </main>
    </div>
  )
}

export default HomePage
