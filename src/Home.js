import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";

/* eslint-disable react-hooks/exhaustive-deps */
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";

import Dashboard from "./Dashboard";
import GamblingComponent from "./Gambling";
import AccountHistories from "./AccountHistories";
import "./Home.css";
import App from "./App";
import UserProfile from "./UserProfile";
import MintNFT from "./MintNFT";
import Governance from "./Governance";
import ErrorPage from "./ErrorPage";
import MyNFT from "./artifacts/contracts/TicketNFT.sol/TicketNFT.json";

const nftId = process.env.REACT_APP_NFT_ID ?? "";
const nftAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS ?? "";

function Home() {
  const secretUUID = process.env.REACT_APP_SECRET_MINT_NFT_LINK;
  const buttonText = useRef("Connect Wallet");
  const { sdk, connected, ready } = useSDK();
  const [hasNFT, setHasNFT] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleWalletConnect = async () => {
    if (connected) {
      await sdk.disconnect();
    } else {
      await sdk.connect();
    }
  };
  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      const verifyOwnership = async () => {
        const ownsNFT = await checkNFTOwnership();
        setHasNFT(ownsNFT);
        setIsLoading(false);
      };

      verifyOwnership();
    }, []);

    if (isLoading) {
      return <div>Loading...</div>; // Or any other loading indicator
    }

    return hasNFT ? children : <Navigate to="/errorPage" />;
  };

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function checkNFTOwnership() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(nftAddress, MyNFT.abi, provider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address, nftId);

      console.log(balance);
      if (balance > 0) {
        console.log("have nft");
        return true;
      } else {
        console.log("don't have nft");
        return false;
      }
    }
  }

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
            <Route
              path="/gambling"
              element={
                <ProtectedRoute>
                  <GamblingComponent />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-histories"
              element={
                <ProtectedRoute>
                  <AccountHistories />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/governance"
              element={
                <ProtectedRoute>
                  <Governance />
                </ProtectedRoute>
              }
            />

            {/* to-do: we should remove this route after demo */}
            <Route path={`/${secretUUID}`} element={<MintNFT />} />
            <Route path="/app" element={<App />} />
            <Route path="/errorPage" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Home;
