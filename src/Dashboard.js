import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";

import "./Dashboard.css";
import DonationContract from "./artifacts/contracts/DonationContract.sol/DonationContract.json";
import UserProfileABI from "./artifacts/contracts/UserProfile.sol/UserProfile.json";

const userProfileContractAddress =
  process.env.REACT_APP_USER_PROFILE_CONTRACT_ADDRESS;

function Dashboard() {
  const [balance, setBalance] = useState("0.0000");
  const [donationAmount, setDonationAmount] = useState("0.001");
  const [isLoading, setIsLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const provider = useMemo(
    () => new ethers.providers.Web3Provider(window.ethereum),
    []
  );
  //const signer = provider.getSigner();
  const contractAddress = "0x07979Bcd337d9c24b797ecFC1AE405ac76555421";
  const donationContractAddress = "0x5B24d35Db30CdD402Cb89408228D0719AfE10dc8";
  //const contractABI = []; // Replace with your contract ABI

  const fetchMoneyPoolBalance = useCallback(async () => {
    try {
      const balanceWei = await provider.getBalance(contractAddress);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEther).toFixed(5));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [provider, contractAddress]);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const donate = async (signer) => {
    const contract = new ethers.Contract(
      donationContractAddress,
      DonationContract.abi,
      signer
    );

    try {
      const tx = await contract.donate({
        value: ethers.utils.parseEther(donationAmount),
      });
      await tx.wait();
      console.log("Donation successful!");
      // Optionally, fetch updated data or execute other logic
    } catch (error) {
      console.error("Error making the donation:", error);
    }

    // alternative code to donate money, don't need solidity
    /*
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
    */

    const userProfileContract = new ethers.Contract(
      userProfileContractAddress,
      UserProfileABI.abi,
      signer
    );

    const updateTx = await userProfileContract.updateDonation(
      signer.getAddress(),
      ethers.utils.parseEther(donationAmount)
    );
    await updateTx.wait();
  };

  async function handleDonate() {
    if (!donationAmount) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

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

  useEffect(() => {
    fetchMoneyPoolBalance();
  }, [fetchMoneyPoolBalance]);

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
