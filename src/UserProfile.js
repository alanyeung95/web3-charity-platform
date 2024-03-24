import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import UserProfileABI from "./artifacts/contracts/UserProfile.sol/UserProfile.json";
import "./UserProfile.css";

//const contractAddress = "0x0cDc6bF230F5bB9DD38CDcfE1d90bf462EbFeb0f";
const userProfileContractAddress =
  process.env.REACT_APP_USER_PROFILE_CONTRACT_ADDRESS;

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [walletBalance, setWalletBalance] = useState("0 ETH");
  const [donationAmount, setDonationAmount] = useState("0 ETH");
  const [photoUrl, setPhotoUrl] = useState(
    "https://avatars.githubusercontent.com/u/45751387?v=4"
  );

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleSelfIntroductionChange = (event) =>
    setSelfIntroduction(event.target.value);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log(signer);
      console.log(UserProfileABI);

      const contract = new ethers.Contract(
        userProfileContractAddress,
        UserProfileABI.abi,
        signer
      );

      try {
        await contract.setProfile(username, selfIntroduction);
        console.log("Profile updated on blockchain");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const fetchProfile = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        userProfileContractAddress,
        UserProfileABI.abi,
        provider
      );
      const signerAddress = await provider.getSigner().getAddress();

      try {
        const profile = await contract.getProfile(signerAddress);
        setUsername(profile.username);
        setSelfIntroduction(profile.selfIntroduction);

        setDonationAmount(
          parseFloat(ethers.utils.formatEther(profile.totalDonations)).toFixed(
            4
          ) + " ETH"
        );

        const balance = await provider.getBalance(signerAddress);
        setWalletBalance(
          parseFloat(ethers.utils.formatEther(balance)).toFixed(4) + " ETH"
        );
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  const handleAvatarChange = () => {
    console.log("Avatar Updated:", photoUrl);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <div className="avatar-section">
        <img
          src={photoUrl}
          alt="User"
          style={{ maxWidth: "200px", marginBottom: "10px" }}
        />

        <button onClick={handleAvatarChange}>Edit Avatar</button>
      </div>
      <form onSubmit={handleProfileUpdate}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Self Introduction:</label>
          <textarea
            value={selfIntroduction}
            onChange={handleSelfIntroductionChange}
          ></textarea>
        </div>
        <div>
          <label>Wallet Balance:</label>
          <span>{walletBalance}</span>
        </div>
        <div>
          <label>Total Donation:</label>
          <span>{donationAmount}</span>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
