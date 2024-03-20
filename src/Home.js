import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import Dashboard from "./Dashboard";
import Gambling from "./Gambling";
import AccountHistories from "./AccountHistories";
import "./Home.css";

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
          </ul>
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          <Routes>
            <Route path="/gambling" element={<Gambling />} />
            <Route path="/account-histories" element={<AccountHistories />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Home;
