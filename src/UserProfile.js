import React, { useState } from "react";

import "./UserProfile.css";

//import { useStorageUpload } from "@thirdweb-dev/react";

const UserProfile = () => {
  const dummyWalletBalance = "1.23 ETH";
  const [username, setUsername] = useState("John Doe");

  // State for photo URL
  const [photoUrl, setPhotoUrl] = useState(
    "https://avatars.githubusercontent.com/u/45751387?v=4"
  );

  const [selfIntroduction, setSelfIntroduction] = useState("Hi, I'm John Doe.");
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleSelfIntroductionChange = (event) =>
    setSelfIntroduction(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Profile Updated:", { username, photoUrl, selfIntroduction });
    // Logic to handle profile update goes here
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Photo: </label>
          <img
            src={photoUrl}
            alt="User"
            style={{ maxWidth: "200px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Self Introduction: </label>
          <textarea
            value={selfIntroduction}
            onChange={handleSelfIntroductionChange}
          ></textarea>
        </div>
        <div>
          <label>Wallet Balance: </label>
          <span>{dummyWalletBalance}</span>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
