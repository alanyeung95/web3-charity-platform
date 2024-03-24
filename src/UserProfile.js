import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import UserProfileABI from "./artifacts/contracts/UserProfile.sol/UserProfile.json";
import "./UserProfile.css";

const UserProfile = () => {
  const contractAddress = "0xa599B74Dd70cD5F15EF0A57C3FE7FFf29BD33586";

  const [username, setUsername] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [walletBalance, setWalletBalance] = useState("0 ETH");
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
        contractAddress,
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
        contractAddress,
        UserProfileABI.abi,
        provider
      );
      const signerAddress = await provider.getSigner().getAddress();

      try {
        const profile = await contract.getProfile(signerAddress);
        setUsername(profile.username);
        setSelfIntroduction(profile.selfIntroduction);

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
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
