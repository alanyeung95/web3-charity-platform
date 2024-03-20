## Local Solidity Deployment

config your hardhat.config.js, put your Alchemy api key and metamask wallet key

```
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/xxxxxxxx",
      accounts: [
        `0x{METAMASK_PRIVATE_KEY}`,
      ],
    },
```

## Deploy Solidity code to testnet

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

npx hardhat run scripts/mint-nft.js --network sepolia

## Start frontend UI

```
npm run start
```
