const hre = require("hardhat");

async function main() {
  const Gambling = await hre.ethers.getContractFactory("Gambling");

  const donationContractAddress = process.env.REACT_APP_DONATION_CONTRACT_ADDRESS;
  const greeterAddress = process.env.REACT_APP_GREETER_ADDRESS;

  const gambling = await Gambling.deploy(donationContractAddress, greeterAddress, 3);

  await gambling.deployed();

  console.log("Gambling deployed to:", gambling.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

