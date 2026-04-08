import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Explore from './components/Explore';
import './App.css'; // Fixed spacing here

function App() {
  return (
    <Router>
      {/* Added className="App" to apply the fancy background */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Explore" element={<Explore />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
