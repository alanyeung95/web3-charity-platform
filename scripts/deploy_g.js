const hre = require("hardhat");

async function main() {
  const Gambling = await hre.ethers.getContractFactory("Gambling");
  const gambling = await Gambling.deploy(3, "0xc0a00F3bB332a453191794626050Fc6eDe9800dB");

  await gambling.deployed();

  console.log("Gambling deployed to:", gambling.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
