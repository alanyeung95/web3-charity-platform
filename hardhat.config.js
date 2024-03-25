require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    // hardhat: {
    //   chainId: 1337,
    // }

    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/Ura5v_TEko6jXcA1SHmb0BRphC3SYVgO",
      accounts: [`0x09c6468104b687cb99280013221a9251c2c23fd72598508b648c5376a2e205e2`]
    },
  },
};
