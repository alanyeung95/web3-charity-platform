import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import GovernanceABI from "./artifacts/contracts/Governance.sol/Governance.json";
import DonationContract from "./artifacts/contracts/DonationContract.sol/DonationContract.json";

const Governance = () => {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState("");

  const governanceContractAddress = process.env.REACT_APP_GOVERNANCE_ADDRESS;
  const donationContractAddress =
    process.env.REACT_APP_DONATION_CONTRACT_ADDRESS;

  useEffect(() => {
    const fetchNgos = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const governanceContract = new ethers.Contract(
        governanceContractAddress,
        GovernanceABI.abi,
        provider
      );

      const ngos = await governanceContract.getNGOs();
      setNgos(ngos);
    };

    fetchNgos();
  }, []);

  const handleVote = async () => {
    if (!selectedNgo) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const governanceContract = new ethers.Contract(
      governanceContractAddress,
      GovernanceABI,
      signer
    );

    await governanceContract.voteForNGO(parseInt(selectedNgo));
    alert("Vote submitted!");
  };

  const handleMoneyDonationFromThePool = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = signer.getAddress();

      const governanceContract = new ethers.Contract(
        governanceContractAddress,
        GovernanceABI.abi,
        signer
      );

      try {
        const [ngos, voteCounts] = await governanceContract.getAllNGOVotes();

        let highestVotes = 0;
        let highestVotedNGO = { name: "", walletAddress: "", votes: 0 };

        for (let i = 0; i < ngos.length; i++) {
          if (voteCounts[i].toNumber() > highestVotes) {
            highestVotes = voteCounts[i].toNumber();
            highestVotedNGO = {
              name: ngos[i].name,
              walletAddress: ngos[i].walletAddress,
              votes: highestVotes,
            };
          }
        }

        console.log("NGO with highest votes:", highestVotedNGO);

        try {
          const donationContract = new ethers.Contract(
            donationContractAddress,
            DonationContract.abi,
            signer
          );

          const tx = await donationContract.transferToNGO(
            highestVotedNGO.walletAddress
          );
          await tx.wait();
          console.log(`Funds transferred to ${highestVotedNGO.name}`);
        } catch (error) {
          console.error("Error transferring funds to NGO:", error);
        }
      } catch (error) {
        console.error("Error fetching highest voted NGO:", error);
      }

      return;
    }
  };

  return (
    <div>
      <h1>NGO Governance</h1>
      <select
        onChange={(e) => setSelectedNgo(e.target.value)}
        value={selectedNgo}
      >
        <option value="">Select an NGO</option>
        {ngos.map((ngo, index) => (
          <option key={index} value={index}>
            {ngo.name}
          </option>
        ))}
      </select>
      <button onClick={handleVote}>Vote</button>
      <button onClick={handleMoneyDonationFromThePool}>
        Donte money from the pool
      </button>
    </div>
  );
};

export default Governance;
