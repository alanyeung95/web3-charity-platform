const hre = require("hardhat");

async function main() {
  const Gambling = await hre.ethers.getContractFactory("Gambling");

  const gambling = await Gambling.deploy("0x8e025c57F9Cca2F6FE6fa2730A6c3a95633F4a7D", "0xc7B6ccff79bAeF2F6E8696D36B8c44Ca15a9c619", 3);

  await gambling.deployed();

  console.log("Gambling deployed to:", gambling.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

