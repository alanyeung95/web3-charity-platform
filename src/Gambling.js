// Gambling.js

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Gambling from "./artifacts/contracts/Gambling.sol/Gambling.json";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import UserProfile from "./artifacts/contracts/UserProfile.sol/UserProfile.json";
import "./Gambling.css";

const gamblingAddress = process.env.REACT_APP_GAMBLING_ADDRESS;
const greeterAddress = process.env.REACT_APP_GREETER_ADDRESS;
const donationContractAddress = process.env.REACT_APP_DONATION_CONTRACT_ADDRESS;
const userProfileAddress = process.env.REACT_APP_USER_PROFILE_CONTRACT_ADDRESS;

const GamblingComponent = () => {
  const [moneyPool, setMoneyPool] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  // const [withdrawAmount, setWithdrawAmmount] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [selectedPre, setSelectedPre] = useState(0);
  const [bPrice, setBPrice] = useState(null);
  const [ePrice, setEPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [eventData, setEventData] = useState(null);
  const [result, setResult] = useState(null);

  let provider, signer, contract;

  // Requests access to the user's Meta Mask Account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const listenForPredictionResult = async () => {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

    contract.on("PredictionResult", async (user, winOrLose, originalBet) => {
      // Update your state or UI here
      console.log(`winOrLose: ${winOrLose}, Reward: ${originalBet}`);
      console.log(user);

      if (winOrLose === 1) {
        const userProfileContract = new ethers.Contract(
          userProfileAddress,
          UserProfile.abi,
          signer
        );

        const scoreToAdd = originalBet * 0.4;
        try {
          const tx = await userProfileContract.increaseScore(
            user,
            scoreToAdd.toString()
          );
          await tx.wait();
          console.log("Score updated successfully");
        } catch (error) {
          console.error("Error updating score:", error);
        }
      }

      contract.removeAllListeners("PredictionResult");
    });
  };

  useEffect(() => {
    handleShowInfo();
    fetchBTCPrice();
  }, []);

  // show money_pool
  async function handleShowInfo() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

    console.log("fetchMoneyPoolBalance");

    try {
      const balanceWei = await provider.getBalance(donationContractAddress);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setMoneyPool(parseFloat(balanceEther).toFixed(5));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }

    //const amount = await contract.getMoneyPoolBalance();
    //const amount_f = ethers.utils.formatEther(amount);
    const balance = await contract.getUserBalance();
    const balance_f = ethers.utils.formatEther(balance);
    //setMoneyPool(amount_f);
    setUserBalance(balance_f);
  }

  //deposit
  async function handleDeposit() {
    if (!depositAmount) return;
    try {
      if (selectedPre !== 0) {
        if (typeof window.ethereum !== "undefined") {
          await requestAccount();

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            gamblingAddress,
            Gambling.abi,
            signer
          );

          const ethValue = ethers.utils.parseEther(depositAmount);
          const depositTx = await contract.depositAndPredict(selectedPre, {
            value: ethValue,
          });
          await depositTx.wait();
          setDepositAmount("");
          handleShowInfo();
        }
      } else {
        alert("you need to select your prediction first");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handlResult() {
    try {
      listenForPredictionResult();

      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          gamblingAddress,
          Gambling.abi,
          signer
        );

        const result = await contract.revealResult();
        await result.wait();
        setResult(result);

        handleShowInfo();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fetches the current value store in greeting
  async function fetchBTCPrice() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const signer = new ethers.providers.Web3Provider(
        window.ethereum
      ).getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      try {
        const data2 = await contract.getLatestPrice();
        const decimalValue = ethers.BigNumber.from(data2).toString();
        setBPrice(decimalValue);
        // const data3 = await contract.getETHLatestPrice();
        // setEPrice(ethers.utils.formatEther(data3));
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  return (
    <div>
      <div className="heading">
        <h1>Gambling</h1>
        {/* money_pool */}
        <h2>Money pool: {moneyPool}</h2>

        {/* show prices */}
        <div>
          <h3>Bitcoin Price: {bPrice}</h3>
          {/* <h3>Ethereum price: {ePrice}</h3> */}
        </div>
      </div>

      <div className="container">
        <div className="left">
          <h3>Please choose your prediction:</h3>
          <div className="selections">
            <button className="but" onClick={() => setSelectedPre(1)}>
              lower
            </button>
            <button className="but" onClick={() => setSelectedPre(2)}>
              unchanged
            </button>
            <button className="but" onClick={() => setSelectedPre(3)}>
              higher
            </button>
          </div>
        </div>

        <div className="right">
          {/* start game */}
          <h3>The amount you bet: {userBalance}</h3>
          <div className="selections">
            <input
              className="in"
              onChange={(e) => setDepositAmount(e.target.value)}
              value={depositAmount}
              placeholder="deposit amount"
              type="number"
            />
            <button
              className="but"
              onClick={handleDeposit}
              style={{ backgroundColor: "#A1C398" }}
            >
              deposit
            </button>

            <button
              className="but"
              onClick={handlResult}
              style={{ backgroundColor: "#FA7070" }}
            >
              show result
            </button>
          </div>
        </div>
      </div>
      {selectedPre !== 0 && (
        <h4 style={{ textAlign: "center" }}>
          You predict that bitcoin price will get
          <span style={{ fontSize: "20px" }}>
            {selectedPre === 1 && " Lower "}
            {selectedPre === 2 && " Unchanged "}
            {selectedPre === 3 && " Higher "}
          </span>
          10 minutes later
        </h4>
      )}
    </div>
  );
};

export default GamblingComponent;

// //withdraw
// async function handleWithdraw() {
//   if (!withdrawAmount) return;
//   try {
//     if (selectedPre !== 0) {
//       if (typeof window.ethereum !== "undefined") {
//         await requestAccount();
//         const provider = new ethers.providers.Web3Provider(window.ethereum)
//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

//         const ethValue = ethers.utils.parseEther(withdrawAmount);
//         const withdrawTx = await contract.withdraw(ethValue);
//         await withdrawTx.wait();

//         const amount = await contract.getUserBalance();
//         const amountF = ethers.utils.formatEther(amount);
//         setUserBalance(amountF);
//       }
//       else {
//         alert("Please install MetaMask or another Web3 provider extension");
//       }
//     } else {
//       alert("Please select a prediction first.");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

{
  /* withdraw  */
}
{
  /* <button onClick={handleWithdraw} style={{ backgroundColor: "red" }}>
        withdraw
      </button>
      <input
        onChange={(e) => setWithdrawAmmount(e.target.value)}
        value={withdrawAmount}
        placeholder="withdraw amount"
        type="number"
      /> */
}
