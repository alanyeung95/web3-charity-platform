import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

import UserProfileABI from "./artifacts/contracts/UserProfile.sol/UserProfile.json";
import "./UserProfile.css";

const userProfileContractAddress =
  process.env.REACT_APP_USER_PROFILE_CONTRACT_ADDRESS;

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [walletBalance, setWalletBalance] = useState("0 ETH");
  const [donationAmount, setDonationAmount] = useState("0 ETH");
  const [score, setScore] = useState("0 ETH");
  const [photoUrl, setPhotoUrl] = useState(
    "https://bafybeigddt6osaj5fx3qszhs74tjv46yns7jbe3jwxga3frvhbzjoyc5gm.ipfs.w3s.link/avatar.png"
  );
  const [file, setFile] = useState(null);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleSelfIntroductionChange = (event) =>
    setSelfIntroduction(event.target.value);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        userProfileContractAddress,
        UserProfileABI.abi,
        signer
      );

      try {
        await contract.setProfile(username, selfIntroduction, photoUrl);
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
        setPhotoUrl(profile.photoURL);
        setScore(
          parseFloat(ethers.utils.formatEther(profile.score)).toFixed(4) +
            " ETH"
        );
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Uploaded file CID:", response.data.cid);
      alert("File uploaded successfully");

      console.log(response.data.cid);
      const newURL =
        "https://" + response.data.cid + ".ipfs.w3s.link/avatar.png";
      setPhotoUrl(newURL);
      console.log(newURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
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

        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Image</button>
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
        <div>
          <label>Score:</label>
          <span>{score}</span> {/* Display the score */}
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
