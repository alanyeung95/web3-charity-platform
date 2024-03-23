const hre = require("hardhat");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);

  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy("testing nft");
  await ticketNFT.deployed();
  console.log("TicketNFT deployed to:", ticketNFT.address);

  const DonationContract = await hre.ethers.getContractFactory(
    "DonationContract"
  );
  const donationContract = await DonationContract.deploy(
    "0x07979Bcd337d9c24b797ecFC1AE405ac76555421"
  );
  await donationContract.deployed();
  console.log("DonationContract deployed to:", donationContract.address);

  /*
  // Deploy SampleCoin contract
  const SampleCoin = await hre.ethers.getContractFactory("SampleCoin");
  const sampleCoin = await SampleCoin.deploy();
  await sampleCoin.deployed();
  console.log("SampleCoin deployed to:", sampleCoin.address);
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
