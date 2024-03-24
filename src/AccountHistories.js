import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import DonationContractABI from "./artifacts/contracts/DonationContract.sol/DonationContract.json";
import "./AccountHistories.css";

const AccountHistories = () => {
  const donationContractAddress = "0x5B24d35Db30CdD402Cb89408228D0719AfE10dc8";

  const [donationHistory, setDonationHistory] = useState([]);

  const fetchDonationHistory = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        donationContractAddress,
        DonationContractABI.abi,
        provider
      );

      const events = await contract.queryFilter(
        contract.filters.DonationReceived()
      );

      const historyPromises = events.map(async (event) => {
        const block = await provider.getBlock(event.blockNumber);
        return {
          timestamp: block.timestamp,
          date: new Date(block.timestamp * 1000).toLocaleString(), // Convert Unix timestamp to date
          type: "Donation",
          amount: `${ethers.utils.formatEther(event.args.amount)} ETH`,
          transactionHash: event.transactionHash,
        };
      });

      const history = await Promise.all(historyPromises);
      history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setDonationHistory(history);
    } catch (error) {
      console.error("Error fetching donation history:", error);
    }
  };

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  return (
    <div className="account-histories">
      <h1>Account Histories</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {donationHistory.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.type}</td>
              <td>{entry.amount}</td>
              <td>
                <a
                  href={`https://sepolia.etherscan.io/tx/${entry.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {entry.transactionHash}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountHistories;
