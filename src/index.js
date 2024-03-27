import React from "react";
import ReactDOM from "react-dom/client";
import { MetaMaskProvider } from "@metamask/sdk-react";

import "./index.css";
import Home from "./Home";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MetaMaskProvider
    debug={false}
    sdkOptions={{
      dappMetadata: {
        name: "Web3 Charity Platform",
        url: window.location.href,
      },
    }}
  >
    <Home />
  </MetaMaskProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
