const hre = require("hardhat");

require("dotenv").config();

async function main() {
  // uncomment the deploy.js if applicable

  /*
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.deployed();
  console.log("UserProfile deployed to:", userProfile.address);
*/
  /*
  const Governance = await hre.ethers.getContractFactory("Governance");
  const governance = await Governance.deploy();
  await governance.deployed();
  console.log("Governance deployed to:", governance.address);
*/

  let oracleAddress = "";
  let donationContractAddress = "";
  /*
  const DonationContract = await hre.ethers.getContractFactory(
    "DonationContract"
  );
  const donationContract = await DonationContract.deploy(
    "0x07979Bcd337d9c24b797ecFC1AE405ac76555421"
  );
  await donationContract.deployed();
  console.log("DonationContract deployed to:", donationContract.address);

  donationContractAddress = donationContract.address

  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy();
  await oracle.deployed();
  console.log("Oracle deployed to:", oracle.address);

  oracleAddress = oracle.address;
*/
  ///*
  //deploy gambling
  if (donationContractAddress === "")
    donationContractAddress = process.env.REACT_APP_DONATION_CONTRACT_ADDRESS;
  if (oracleAddress === "")
    oracleAddress = process.env.REACT_APP_ORACLE_ADDRESS;

  const GamblingContract = await hre.ethers.getContractFactory("Gambling");
  const gambling = await GamblingContract.deploy(
    donationContractAddress,
    oracleAddress,
    3
  );
  await gambling.deployed();
  console.log("GamblingContract deployed to:", gambling.address);

  //*/

  /*
  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy("testing nft");
  await ticketNFT.deployed();
  console.log("TicketNFT deployed to:", ticketNFT.address);
*/
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
