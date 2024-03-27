const hre = require("hardhat");

async function main() {
  const Gambling = await hre.ethers.getContractFactory("Gambling");

  const donationContractAddress = "0x9803156dcBc9b2fE1d47DeBd928F157F71832E51";
  const greetingAddress = "0xc7B6ccff79bAeF2F6E8696D36B8c44Ca15a9c619";

  const gambling = await Gambling.deploy(donationContractAddress, greetingAddress, 3);

  await gambling.deployed();

  console.log("Gambling deployed to:", gambling.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

