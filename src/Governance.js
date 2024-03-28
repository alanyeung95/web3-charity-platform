import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import GovernanceABI from "./artifacts/contracts/Governance.sol/Governance.json";
import DonationContract from "./artifacts/contracts/DonationContract.sol/DonationContract.json";
import "./Governance.css";

const Governance = () => {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState("");
  const [transactions, setTransactions] = useState([]);

  const governanceContractAddress = process.env.REACT_APP_GOVERNANCE_ADDRESS;
  const donationContractAddress =
    process.env.REACT_APP_DONATION_CONTRACT_ADDRESS;

  const fetchNgos = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const governanceContract = new ethers.Contract(
      governanceContractAddress,
      GovernanceABI.abi,
      provider
    );

    const [ngoList, voteCounts] = await governanceContract.getAllNGOVotes();
    const ngoData = ngoList.map((ngo, index) => ({
      ...ngo,
      votes: voteCounts[index].toNumber(),
    }));

    return ngoData;
  };

  const fetchTransactionHistory = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const donationContract = new ethers.Contract(
      donationContractAddress,
      DonationContract.abi,
      provider
    );

    const filter = donationContract.filters.FundsTransferredToNGO();
    const events = await donationContract.queryFilter(filter);

    // Fetching the NGOs here to ensure we have the latest list
    const ngos = await fetchNgos();
    setNgos(ngos);

    const transactionHistoryPromises = events.map(async (event) => {
      const block = await provider.getBlock(event.blockNumber);
      // Find the NGO that matches the receiver address
      const ngoName =
        ngos.find((ngo) => ngo.walletAddress === event.args.ngoAddress)?.name ||
        "Unknown NGO";

      return {
        receiver: ngoName,
        amount: ethers.utils.formatEther(event.args.amount),
        transactionHash: event.transactionHash,
        timestamp: block.timestamp,
        date: new Date(block.timestamp * 1000).toLocaleString(),
      };
    });

    const transactionHistory = await Promise.all(transactionHistoryPromises);
    transactionHistory.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setTransactions(transactionHistory);
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const handleRadioChange = async (index) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const governanceContract = new ethers.Contract(
      governanceContractAddress,
      GovernanceABI.abi,
      signer
    );
    await governanceContract.voteForNGO(index);
    alert("Vote submitted for NGO #" + index);
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
    <div className="governance-container">
      <h1 className="governance-title">NGO Governance</h1>
      <p>You can vote for one of the following NGOs</p>
      <form className="ngo-list">
        {ngos.map((ngo, index) => (
          <div className="ngo-item" key={index}>
            <input
              type="radio"
              id={`ngo-${index}`}
              name="ngo"
              value={index}
              onChange={() => handleRadioChange(index)}
            />
            <label htmlFor={`ngo-${index}`}>
              {ngo.name} (Votes: {ngo.votes})
            </label>{" "}
          </div>
        ))}
      </form>
      <div className="transaction-history">
        <h2>Donation History</h2>
        <table>
          <thead>
            <tr>
              <th> Date</th>

              <th> Receiver</th>
              <th>Amount (ETH)</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.date}</td>
                <td>{tx.receiver}</td>
                <td>{tx.amount}</td>

                <td>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.transactionHash}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Governance;
