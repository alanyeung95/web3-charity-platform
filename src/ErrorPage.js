import React from "react";
import { Link } from "react-router-dom";

import "./ErrorPage.css";

const ErrorPage = () => {
  const mintLink = "3dd4b65f-f1f2-4cb4-bc4d-f115b87016fd";

  return (
    <div className="error-page">
      <h1>Access Restricted</h1>
      <p>You must own the Web3 Charity Platform NFT to access this content.</p>
      <p>
        Since we are currently in beta testing, you have the opportunity to mint
        your NFT ticket. Please visit the link below to mint your NFT.
      </p>
      <Link to={`/${mintLink}`} className="mint-link">
        Mint NFT Ticket
      </Link>
    </div>
  );
};

export default ErrorPage;
