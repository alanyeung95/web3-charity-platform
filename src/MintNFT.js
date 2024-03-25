import "./MintNFT.css";
import nftPlaceholder from "./images/nftPlaceHolder.svg";
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import MyNFT from "./artifacts/contracts/TicketNFT.sol/TicketNFT.json";
const MintNFT = () => {
  const nftId = "9527";
  const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    "0xfF13D2d139f1997B66DF4D97A1A6A127A615A9eB",
    MyNFT.abi,
    ethProvider
  );

  const mintNft = async () => {
    if (!account || account === "") return;

    const signer = ethProvider.getSigner();
    const mintTx = await contract
      .connect(signer)
      .mintFromMarketPlace(account, nftId);
    const result = await mintTx.wait();
    console.log(result);
    console.log(`NFT with ID ${nftId} has been minted to ${account}`);
  };

  const [hasNFT, setHasNFT] = useState(false);
  const { connected, account, provider } = useSDK();

  useEffect(() => {
    if (connected && account) {
      console.log("check!");
      const checkNFTOwnership = async () => {
        const balance = await contract.balanceOf(account, "9527");

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
