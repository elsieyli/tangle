import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        {/* Placeholder video URL */}
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main content */}
      <main className="text-center mt-20 z-10">
        <h1 className="text-6xl font-cursive text-blue-700">Tangle</h1>
        <p className="text-xl text-gray-700 mt-4">connect the north</p>

        {/* Buttons */}
        <div className="mt-10">
          <button className="px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors">
            Start now
          </button>
          <p className="mt-4 text-lg">
            or <a href="/login" className="underline text-blue-500 hover:text-blue-700">login</a>
          </p>
        </div>
      </main>

      {/* Organizer Dash (bottom right) */}
      <div className="absolute bottom-5 right-5 text-gray-500">
        <p>organizer dash</p>
      </div>
    </div>
  );
};

export default Home;
