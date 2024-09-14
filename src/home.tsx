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

      {/* Navbar */}
      <header className="w-full py-4 bg-blue-600 text-white shadow-md fixed top-0 left-0 z-10">
        <nav className="container mx-auto flex justify-between items-center px-4">
          {/* Search bar on the left */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 text-black rounded-md focus:outline-none"
            />
          </div>

          {/* Center: Title */}
          <h1 className="text-2xl font-semibold">welcome</h1>

          {/* Right: Dropdown */}
          <div className="relative inline-block text-left">
            <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              Options
            </button>
            {/* Dropdown options */}
            <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <a href="#action" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a href="#action" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <a href="#action" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

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
