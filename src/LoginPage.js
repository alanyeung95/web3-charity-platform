/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Import ABI Code to interact with smart contract
import MyNFT from "./artifacts/contracts/TicketNFT.sol/TicketNFT.json";

const nftAddress = "0xC93cF38aAE74097824dFeb689d5D9e7E0F88Bb5e";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Requests access to the user's Meta Mask Account
  // https://metamask.io/
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
      const balance = await contract.balanceOf(address, "9321");

      console.log(balance);
      if (balance > 0) {
        console.log("have nft");
        //setHasNFT(true);
      } else {
        console.log("don't have nft");
        //setHasNFT(false);
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Login with:", username, password);
  };

  useEffect(() => {
    checkNFTOwnership();
  }, [checkNFTOwnership]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
