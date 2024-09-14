
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Navbar from './Navbar';
import Home from './home';  // Import Home or other components you need

const App: React.FC = () => {
  return (
    <Router> {/* Wrap your entire app in BrowserRouter */}
      <Navbar /> {/* Navbar component */}
      <Home /> {/* Other components such as Home, About, etc. */}
    </Router>
  );
};

export default App;
