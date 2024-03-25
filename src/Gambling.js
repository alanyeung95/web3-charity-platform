// Gambling.js
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Gambling from "./artifacts/contracts/Gambling.sol/Gambling.json";
import "./Gambling.css";


const gamblingAddress = "0x4214239224604479c20af9165c3220FFE68C4cC7";


const GamblingComponent = () => {

  const [moneyPool, setMoneyPool] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmmount] = useState('');
  const [userBalance, setUserBalance] = useState(null);
  const [selectedPre, setSelectedPre] = useState(null);
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

    // const ethValue = ethers.utils.parseEther("10");
    // const transaction = await contract.deposit_into_moneyPool({ value: ethValue });
    // await transaction.wait();


    const amount = await contract.getmoneyPool();
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

  async function handlePreSelection(pre) {
    try {

      if (pre !== null) {
        if (typeof window.ethereum !== "undefined") {
          await requestAccount();
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner();
          const contract = new ethers.Contract(gamblingAddress, Gambling.abi, signer);

          const transaction = await contract.predict(pre);
          transaction.wait();
          console.log("start prediction: ", pre);
        }
      } else {
        alert("Please select a prediction first.");
      }

    } catch (error) {
      console.error(error);
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        handleShowInfo();

      }

    } catch (error) {
      console.error(error);
    }
  };

  // async function checkDeply() {
  //   handleMoneyPool();
  // }

  return (
    <div>
      <h1>Gambling</h1>

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
      <h3>Please choose your prediction:</h3>
      <button onClick={() => handlePreSelection(1)}>lower</button>
      <button onClick={() => handlePreSelection(2)}>unchanged</button>
      <button onClick={() => handlePreSelection(3)}>higher</button>
      <h4>You predict that bitcoin price will get
        <span style={{ fontSize: "30px" }}>
          {selectedPre === 1 && "Lower"}
          {selectedPre === 2 && "unchanged"}
          {selectedPre === 3 && "Higher"}
        </span>
        10 minutes later</h4>
      <button onClick={handlResult}>show result</button>
      {/* <button onClick={checkDeply}>unchanged</button> */}


    </div>
  );
};

export default GamblingComponent;
