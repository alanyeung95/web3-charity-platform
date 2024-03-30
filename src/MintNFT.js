import "./MintNFT.css";
import nftPlaceholder from "./images/nftPlaceHolder.svg";
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import MyNFT from "./artifacts/contracts/TicketNFT.sol/TicketNFT.json";

const MintNFT = () => {
  const nftId = process.env.REACT_APP_NFT_ID ?? "";
  const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS ?? "";

  const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, MyNFT.abi, ethProvider);

  const [hasNFT, setHasNFT] = useState(false);
  const { account } = useSDK();

  const mintNft = async () => {
    if (!account || account.trim() === "") return;

    try {
      const signer = ethProvider.getSigner();
      const mintTx = await contract
        .connect(signer)
        .mintFromMarketPlace(account, nftId);
      await mintTx.wait();
      // to-do: implement toast to notify users the action succeeded
      console.log(`NFT with ID ${nftId} has been minted to ${account}`);
    } catch (error) {
      // to-do: implement toast to notify users the action failed
      console.error("Error minting NFT:", error);
    }
  };

  useEffect(() => {
    const checkNFTOwnership = async () => {
      try {
        const balance = await contract.balanceOf(account, nftId);
        setHasNFT(balance > 0);
      } catch (error) {
        console.error("Error checking NFT ownership:", error);
        setHasNFT(false); // Handle error by setting state appropriately
      }
    };

    if (account) {
      checkNFTOwnership();
    }
  }, [account]);

  return (
    <div className="nft-container">
      <h1>Mint NFT</h1>
      <img
        className="nft-placeholder"
        src={nftPlaceholder}
        alt="placeholder"
      ></img>
      {hasNFT ? (
        <div>You already have a NFT minted!</div>
      ) : (
        <button onClick={mintNft}>Mint a NFT</button>
      )}
    </div>
  );
};

export default MintNFT;
