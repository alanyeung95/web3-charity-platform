/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.24",
  //paths: {
  //  artifacts: "./src/artifacts",
  //},
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //sepolia: {
    //  url: "https://eth-sepolia.g.alchemy.com/v2/rQ7-cMF4HxDoKZsoyQ_XPrg3kHP5sfYA",
    //  accounts: [`0x${AVALANCHE_TEST_PRIVATE_KEY}`],
    //},
  },
};
