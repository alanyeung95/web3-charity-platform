import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import axios from "axios";

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
  const [userProfiles, setUserProfiles] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);

  const provider = useMemo(
    () => new ethers.providers.Web3Provider(window.ethereum),
    []
  );
  //const signer = provider.getSigner();
  const donationContractAddress =
    process.env.REACT_APP_DONATION_CONTRACT_ADDRESS;

  const fetchMoneyPoolBalance = useCallback(async () => {
    try {
      const balanceWei = await provider.getBalance(donationContractAddress);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEther).toFixed(5));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [provider, donationContractAddress]);

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
      const tx = await contract.donateV2({
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

    fetchUserInfo();
    fetchMoneyPoolBalance();
    fetchUserProfiles();
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
      } catch (error) {
        console.error("Error making donation:", error);
        setDonationSuccess(false); // Donation failed
      }
      setIsLoading(false);
      fetchMoneyPoolBalance(); // refresh the balance
    }
  }

  const fetchUserProfiles = useCallback(async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userProfileContract = new ethers.Contract(
        userProfileContractAddress,
        UserProfileABI.abi,
        provider
      );

      const addresses = await userProfileContract.getUserAddresses();
      const profilePromises = addresses.map(async (address) => {
        const profile = await userProfileContract.getProfile(address);
        return {
          address,
          username: profile.username,
          selfIntroduction: profile.selfIntroduction,
          totalDonations: ethers.utils.formatEther(profile.totalDonations),
          score: ethers.utils.formatEther(profile.score),
        };
      });

      const profiles = await Promise.all(profilePromises);
      profiles.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

      setUserProfiles(profiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  }, [userProfileContractAddress]); // put dependencies here, otherwise this function will get triggered again and again

  const handleClaimPrize = async () => {
    console.log("handleClaimPrize");

    if (!userAddress) return;
    setIsClaiming(true);

    try {
      const response = await axios.get("http://localhost:3001/claimPrize", {
        params: { address: userAddress },
      });
      console.log(response);
      alert("Prize claim is complete. Please check your wallet.");
    } catch (err) {
      console.log(err);
      alert("Failed to claim the prize. Please try again.");
    }

    fetchUserInfo();
    fetchMoneyPoolBalance();
    fetchUserProfiles();
    setIsClaiming(false);
  };

  // for debug purpose
  const transferFund = async () => {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const donationContract = new ethers.Contract(
      donationContractAddress,
      DonationContract.abi,
      signer
    );

    const tx = await donationContract.withdrawAllToMoneyPool();
    await tx.wait();
  };

  const fetchUserInfo = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setUserAddress(address);
  }, []);

  const isTopUser = () => {
    return (
      userProfiles.length > 0 &&
      userProfiles[0].address === userAddress &&
      userProfiles[0].score > 0
    );
  };

  useEffect(() => {
    fetchUserInfo();
    fetchMoneyPoolBalance();
    fetchUserProfiles();
  }, [fetchUserInfo, fetchMoneyPoolBalance, fetchUserProfiles]);

  return (
    <div className="Dashboard">
      <div className="Dashboard-header">
        <h1>Web3 Charity Platform</h1>
        <h3>CSC2125 Project</h3>

        <div className="money-pool">
          <h4>Lottery Money Pool</h4>
          <p>{balance} ETH</p>

          {isTopUser() && (
            <div className="top-user-message">
              <p>
                Congratulations! You are the top donator. Click the button to
                claim your prize.
              </p>
              <button
                onClick={handleClaimPrize}
                style={{ backgroundColor: isClaiming ? "#cccccc" : "green" }}
                disabled={isClaiming}
                className="claim-button"
              >
                {isClaiming ? "Claiming..." : "Claim Prize"}
              </button>
            </div>
          )}
        </div>

        <div className="user-rankings">
          <h4>User Rankings</h4>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Wallet Address</th>
                <th>Total Donations</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {userProfiles.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.address}</td>
                  <td>{user.totalDonations} ETH</td>
                  <td>{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      {/*
      <button onClick={transferFund}>
        Debug: Transfer Money from Smart Contract to Metamask Wallet
      </button>
          */}
    </div>
  );
}

export default Dashboard;
