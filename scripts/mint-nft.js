const hre = require("hardhat");

async function main() {
  // You need the contract's address and ABI to interact with it
  const contractAddress = "0x20612DD54Eae1fafd0F2654A7D5c5dc142C03552";
  const Contract = await hre.ethers.getContractFactory("TicketNFT");
  const contract = await Contract.attach(contractAddress);

  // Define the recipient address and the NFT ID you want to mint
  const recipientAddress = "0xCf60A9d71eb7CA8C282b503B50D360E0b5f1bf1d";
  const nftId = 999; // Example NFT ID

  // Calling the mint function
  const mintTx = await contract.mintFromMarketPlace(recipientAddress, nftId);

  // Wait for the transaction to be mined
  const result = await mintTx.wait();
  console.log(result);
  console.log(`NFT with ID ${nftId} has been minted to ${recipientAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
