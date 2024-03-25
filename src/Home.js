import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import Dashboard from "./Dashboard";
import GamblingComponent from "./Gambling";
import AccountHistories from "./AccountHistories";
import "./Home.css";
import App from "./App";

function Home() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div className="nav-bar">
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/gambling">Gambling</Link>
            </li>
            <li>
              <Link to="/account-histories">Account Histories</Link>
            </li>
            <li>
              <Link to="/app">App</Link>
            </li>
          </ul>
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          <Routes>
            <Route path="/gambling" element={<GamblingComponent />} />
            <Route path="/account-histories" element={<AccountHistories />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/app" element={<App />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Home;
