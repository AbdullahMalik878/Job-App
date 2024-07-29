// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is included for collapse
import "./Navbar.css"; // Import custom CSS for styling

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-custom fixed-top shadow-sm">
      <div className="container py-2">
        <Link className="navbar-brand" to="/">
          <h1 className="mb-0">Career Opportunities</h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/jobchart">
                <i className="bi bi-bar-chart-fill me-2"></i>
                Job Chart
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/skilltable">
                <i className="bi bi-table me-2 mx-3"></i>
                Skill Table
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
