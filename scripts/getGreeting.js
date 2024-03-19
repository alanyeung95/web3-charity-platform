const hre = require("hardhat");

async function main() {
  const HelloWorld = await hre.ethers.getContractFactory("HelloWorld");
  const helloWorld = await HelloWorld.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const greeting = await helloWorld.getGreeting();
  console.log("Greeting:", greeting);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
