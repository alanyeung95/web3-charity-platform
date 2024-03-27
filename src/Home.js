import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useSDK } from "@metamask/sdk-react";
import { useEffect, useRef } from "react";

import Dashboard from "./Dashboard";
import Gambling from "./Gambling";
import AccountHistories from "./AccountHistories";
import "./Home.css";
import App from "./App";
import UserProfile from "./UserProfile";
import MintNFT from "./MintNFT";
import Governance from "./Governance";

function Home() {
  const secretUUID = process.env.REACT_APP_SECRET_MINT_NFT_LINK;
  const buttonText = useRef("Connect Wallet");
  const { sdk, connected, ready } = useSDK();

  const toggleWalletConnect = async () => {
    if (connected) {
      await sdk.disconnect();
    } else {
      await sdk.connect();
    }
  };

  useEffect(() => {
    buttonText.current = connected ? "Disconnect Wallet" : "Connect Wallet";

    if (ready && !connected) {
      const connectWallet = async () => {
        await sdk.connect();
      };

      connectWallet();
    }
  }, [ready, connected]);

  return (
    <Router>
      <div className="home">
        <div className="nav-bar">
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">User Profile</Link>
            </li>
            <li>
              <Link to="/gambling">Gambling</Link>
            </li>
            <li>
              <Link to="/account-histories">Account Histories</Link>
            </li>
            <li>
              <Link to="/governance">Governance</Link>
            </li>
            <li>
              <Link to="/app">App</Link>
            </li>
            <li className="wallet-button">
              <button onClick={toggleWalletConnect}>
                {buttonText.current}
              </button>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/gambling" element={<Gambling />} />
            <Route path="/account-histories" element={<AccountHistories />} />
            <Route path="/" element={<Dashboard />} />
            {/* to-do: we should remove this route after demo */}
            <Route path={`/${secretUUID}`} element={<MintNFT />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/app" element={<App />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Home;
