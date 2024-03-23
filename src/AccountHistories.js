import React from "react";

import "./AccountHistories.css";

const AccountHistories = () => {
  // Dummy data for the layout
  const dummyHistoryData = [
    { date: "2023-03-25", type: "Donation", amount: "0.5 ETH" },
    { date: "2023-03-20", type: "Donation", amount: "0.3 ETH" },
  ];

  return (
    <div className="account-histories">
      <h1>Account Histories</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {dummyHistoryData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.type}</td>
              <td>{entry.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountHistories;
