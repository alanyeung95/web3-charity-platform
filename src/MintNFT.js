import "./MintNFT.css";
import nftPlaceholder from "./images/nftPlaceHolder.svg";
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import MyNFT from "./artifacts/contracts/TicketNFT.sol/TicketNFT.json";
const MintNFT = () => {
  const nftId = process.env.NFT_ID ?? "";
  const contractAddress = process.env.NFT_CONTRACT_ADDRESS ?? "";

  const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, MyNFT.abi, ethProvider);

  const [hasNFT, setHasNFT] = useState(false);
  const { connected, account } = useSDK();

  const mintNft = async () => {
    if (!account || account === "") return;

    const signer = ethProvider.getSigner();
    const mintTx = await contract
      .connect(signer)
      .mintFromMarketPlace(account, nftId);
    await mintTx.wait();
    console.log(`NFT with ID ${nftId} has been minted to ${account}`);
  };

  useEffect(() => {
    if (connected && account) {
      const checkNFTOwnership = async () => {
        const balance = await contract.balanceOf(account, nftId);

        balance > 0 ? setHasNFT(true) : setHasNFT(false);
      };

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
