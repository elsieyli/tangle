import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

const App = () => {
  
  return (
    <Router>
    <div>
      <Routes>
        {/* Define routes here */}
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App;

