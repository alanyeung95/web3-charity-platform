// Gambling.js

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Gambling from "./artifacts/contracts/Gambling.sol/Gambling.json";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import "./Gambling.css";

const gamblingAddress = process.env.REACT_APP_GAMBLING_ADDRESS;
const greeterAddress = process.env.REACT_APP_GREETER_ADDRESS;

const GamblingComponent = () => {

  const [moneyPool, setMoneyPool] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
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

  useEffect(() => {
    handleShowInfo();
  }, []);

  // useEffect(() => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const contract = new ethers.Contract(donationContractAddress, DonationContract.abi, provider);

  //   // Subscribe to the ValueChanged event
  //   contract.on("FundsTransferredToUser", (from, newValue) => {
  //     setEventData(prevEventData => [...prevEventData, { from, newValue }]);
  //   });

  //   // Cleanup function to unsubscribe from the event listener
  //   return () => {
  //     contract.removeAllListeners("FundsTransferredToUser");
  //   };
  // }, []);


  // show money_pool
  async function handleShowInfo() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

    const amount = await contract.getMoneyPoolBalance();
    const amount_f = ethers.utils.formatEther(amount);
    const balance = await contract.getUserBalance();
    const balance_f = ethers.utils.formatEther(balance);
    setMoneyPool(amount_f);
    setUserBalance(balance_f);
  }

  //deposit
  async function handleDeposit() {
    if (!depositAmount) return;
    try {
      if (selectedPre !== 0) {
        if (typeof window.ethereum !== "undefined") {
          await requestAccount();
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner();
          const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

          const ethValue = ethers.utils.parseEther(depositAmount);
          const depositTx = await contract.depositAndPredict(selectedPre, { value: ethValue });
          await depositTx.wait();
          setDepositAmount("")
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
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

        const result = await contract.revealResult();
        await result.wait();
        setResult(result);

        handleShowInfo();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetches the current value store in greeting
  async function fetchGreeting() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data2 = await contract.getLatestPrice();
        setBPrice(ethers.utils.formatEther(data2));
        const data3 = await contract.getETHLatestPrice();
        setEPrice(ethers.utils.formatEther(data3));
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
        <h2 >Money pool: {moneyPool}</h2>

        {/* show prices */}
        <div>
          <button onClick={fetchGreeting}>show price</button>
          <h3>bitcoin price: {bPrice}</h3>
          <h3>Ethereum price: {ePrice}</h3>
        </div>
      </div>

      <div className="container">
        <div className="left">
          <h3>Please choose your prediction:</h3>
          <div className="selections">
            <button className="but" onClick={() => setSelectedPre(1)}>lower</button>
            <button className="but" onClick={() => setSelectedPre(2)}>unchanged</button>
            <button className="but" onClick={() => setSelectedPre(3)}>higher</button>
          </div>
        </div>

        <div className="right">
          {/* start game */}
          <h3>user balance: {userBalance}</h3>
          <div className="selections">
            <input
              className="in"
              onChange={(e) => setDepositAmount(e.target.value)}
              value={depositAmount}
              placeholder="deposit amount"
              type="number"
            />
            <button className="but" onClick={handleDeposit} style={{ backgroundColor: "#A1C398" }}>
              deposit
            </button>

            <button className="but" onClick={handlResult} style={{ backgroundColor: "#FA7070" }}>show result</button>
          </div>

        </div>

      </div>
      {selectedPre !== 0 && <h4 style={{ textAlign: "center" }}>You predict that bitcoin price will get
        <span style={{ fontSize: "20px" }}>
          {selectedPre === 1 && " Lower "}
          {selectedPre === 2 && " Unchanged "}
          {selectedPre === 3 && " Higher "}
        </span>
        10 minutes later</h4>}

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

{/* withdraw  */ }
{/* <button onClick={handleWithdraw} style={{ backgroundColor: "red" }}>
        withdraw
      </button>
      <input
        onChange={(e) => setWithdrawAmmount(e.target.value)}
        value={withdrawAmount}
        placeholder="withdraw amount"
        type="number"
      /> */}