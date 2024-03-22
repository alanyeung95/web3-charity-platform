import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./Dashboard.css";

function Dashboard() {
  const [balance, setBalance] = useState("0.0000");
  const [donationAmount, setDonationAmount] = useState("0.001");
  const [isLoading, setIsLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  //const signer = provider.getSigner();
  const contractAddress = "0x07979Bcd337d9c24b797ecFC1AE405ac76555421"; // Replace with your contract address
  //const contractABI = []; // Replace with your contract ABI

  async function fetchMoneyPoolBalance() {
    try {
      const balanceWei = await provider.getBalance(contractAddress);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEther).toFixed(5));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const donate = async (signer) => {
    try {
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.utils.parseEther("0.001"),
      });
      await tx.wait();
      console.log("Donation made!");
    } catch (error) {
      console.error("Error making donation:", error);
    }
  };

  async function handleDonate() {
    if (!donationAmount) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      console.log(signer);

      setIsLoading(true);
      try {
        await donate(signer);
        setDonationSuccess(true); // Donation was successful
        fetchMoneyPoolBalance(); // refresh the balance
      } catch (error) {
        console.error("Error making donation:", error);
        setDonationSuccess(false); // Donation failed
      }
      setIsLoading(false);

      fetchMoneyPoolBalance(); // refresh the balance
    }
  }

  useEffect((fetchMoneyPoolBalance) => {
    fetchMoneyPoolBalance();
  }, []);

  return (
    <div className="Dashboard">
      <div className="Dashboard-header">
        <h1>Web3 Charity Platform</h1>
        <h3>CSC2125 Project</h3>

        <div className="money-pool">
          <h4>Lottery Money Pool</h4>
          <p>{balance} ETH</p>
        </div>
        <div className="donation-section">
          <input
            type="text"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Enter donation amount in ETH"
          />
          <button onClick={handleDonate}>Donate</button>
          {isLoading && <p>Donating...</p>} {/* Loading indicator */}
          {!isLoading && donationSuccess && (
            <div className="success-message">
              <p>Donation Successful! Thank you for your contribution.</p>
              {/* You can add an animation or image here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
