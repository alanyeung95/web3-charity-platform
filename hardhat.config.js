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
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        `0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e`,
      ],
    },
    /*hardhat: {
      chainId: 1337,
    },
    */
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/{YOUR_API_KEY}",
      accounts: [`0x{YOUR_METAMASK_PRIVATE_KEY}`],
    },
  },
};
