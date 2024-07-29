import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Joblistings from "./pages/JobListings";
import ChartComponent from './pages/ChartComponent';
import SkillTableComponent from './pages/SkillTable';

function App() {
  return (
    <Router>
      <div className='container'>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Joblistings />} />
            <Route path="/jobchart" element={<ChartComponent />} />
            <Route path="/skilltable" element={<SkillTableComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
