// Gambling.js
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Gambling from "./artifacts/contracts/Gambling.sol/Gambling.json";
import DonationContract from "./artifacts/contracts/DonationContract.sol/DonationContract.json";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import "./Gambling.css";

const donationContractAddress =
  "0x8e025c57F9Cca2F6FE6fa2730A6c3a95633F4a7D";
const gamblingAddress = "0x81BC43e4Da113287a6E9446659547E8C5dFc0195"
const greeterAddress =
  "0xc7B6ccff79bAeF2F6E8696D36B8c44Ca15a9c619";

const GamblingComponent = () => {

  const [moneyPool, setMoneyPool] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmmount] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [selectedPre, setSelectedPre] = useState(0);
  const [bPrice, setBPrice] = useState(null);
  const [ePrice, setEPrice] = useState(null);
  // const [result, setResult] = useState("");

  let provider, signer, contract;

  // Requests access to the user's Meta Mask Account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  useEffect(() => {
    handleShowInfo();
  }, []);


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
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

        const ethValue = ethers.utils.parseEther(depositAmount);
        const depositTx = await contract.deposit({ value: ethValue });
        await depositTx.wait();

        const amount = await contract.getUserBalance();
        const amountF = ethers.utils.formatEther(amount);
        setUserBalance(amountF);
      }
    } catch (error) {
      console.error(error);
    }
  }

  //withdraw
  async function handleWithdraw() {
    if (!withdrawAmount) return;
    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

        const ethValue = ethers.utils.parseEther(withdrawAmount);
        const withdrawTx = await contract.withdraw(ethValue);
        await withdrawTx.wait();

        const amount = await contract.getUserBalance();
        const amountF = ethers.utils.formatEther(amount);
        setUserBalance(amountF);
      }
      else {
        alert("Please install MetaMask or another Web3 provider extension");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function predict() {
    try {

      if (selectedPre !== 0) {
        if (typeof window.ethereum !== "undefined") {
          await requestAccount();
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner();
          const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

          const transaction = await contract.predict(selectedPre);
          transaction.wait();
          console.log("start prediction: ", selectedPre);
        }
      } else {
        alert("Please select a prediction first.");
      }

    } catch (error) {
      alert(error);
    }
  };

  async function handlResult() {
    try {

      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

        const transaction = await contract.revealResult();
        transaction.wait();
        console.log("transaction", transaction);
        // const reward = transaction[0];
        // const isCorrect = transaction[1];
        // if (isCorrect) {
        //   const contract = new ethers.Contract(donationContractAddress, DonationContract.abi, signer);
        //   // contract.transferToUser()
        // }
        await new Promise(resolve => setTimeout(resolve, 2000));
        handleShowInfo();

      }

    } catch (error) {
      alert(error);
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
        console.log("data2: ", ethers.utils.formatEther(data2));
        setBPrice(ethers.utils.formatEther(data2));

        const data3 = await contract.getETHLatestPrice();
        console.log("data3: ", ethers.utils.formatEther(data3));
        setEPrice(ethers.utils.formatEther(data3));
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function handleAddMoneyToContract() {
    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);
        const ethValue = ethers.utils.parseEther("0.1");
        const transaction = await contract.addMoneyToContract({ value: ethValue });
        transaction.wait();
        console.log("add 0.01 to cotnract");
      }

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Gambling</h1>
      <button onClick={handleAddMoneyToContract} style={{ backgroundColor: "grey" }}>add</button>

      {/* money_pool */}
      <h2 >Money pool: {moneyPool}</h2>

      {/* deposit  */}
      <button onClick={handleDeposit} style={{ backgroundColor: "green" }}>
        deposit
      </button>
      <input
        onChange={(e) => setDepositAmount(e.target.value)}
        value={depositAmount}
        placeholder="deposit amount"
        type="number"
      />
      {/* withdraw  */}
      <button onClick={handleWithdraw} style={{ backgroundColor: "red" }}>
        withdraw
      </button>
      <input
        onChange={(e) => setWithdrawAmmount(e.target.value)}
        value={withdrawAmount}
        placeholder="withdraw amount"
        type="number"
      />
      <h3>user balance: {userBalance}</h3>

      {/* start game */}
      <div>
        <button onClick={fetchGreeting}>show price</button>
        <h3>bitcoin price: {bPrice}</h3>
        <h3>Ethereum price: {ePrice}</h3>
      </div>
      <h3>Please choose your prediction:</h3>
      <button onClick={() => setSelectedPre(1)}>lower</button>
      <button onClick={() => setSelectedPre(2)}>unchanged</button>
      <button onClick={() => setSelectedPre(3)}>higher</button>
      <button onClick={predict}>start</button>
      {selectedPre !== 0 && <h4>You predict that bitcoin price will get
        <span style={{ fontSize: "30px" }}>
          {selectedPre === 1 && "Lower"}
          {selectedPre === 2 && "unchanged"}
          {selectedPre === 3 && "Higher"}
        </span>
        10 minutes later</h4>}
      <button onClick={handlResult}>show result</button>
      {/* <button onClick={checkDeply}>unchanged</button> */}


    </div>
  );
};

export default GamblingComponent;
