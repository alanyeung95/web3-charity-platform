import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import ethers from "ethers";

import { create } from "@web3-storage/w3up-client";
import { filesFromPaths } from "files-from-path";

import DonationContract from "../src/artifacts/contracts/DonationContract.sol/DonationContract.json" assert { type: "json" };
import UserProfileContract from "../src/artifacts/contracts/UserProfile.sol/UserProfile.json" assert { type: "json" };

dotenv.config();

const email = process.env.WEB3_STORAGE_EMAIL;
const key = process.env.WEB3_STORAGE_KEY;
const fundDistributionNode = process.env.FUND_DISTRIBUTION_NODE == "true";

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // hardcode the filename
    cb(null, "avatar.png");
  },
});

const upload = multer({ storage: storage });

const privateKey = process.env.METAMASK_PRIVATE_KEY;
const doncationContractAddress = process.env.DONATION_CONTRACT_ADDRESS;
const userProfileContractAddress = process.env.USER_PROFILE_CONTRACT_ADDRESS;

let provider,
  wallet,
  donationContract,
  userProfileContract = null;

try {
  provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // e.g., Infura/Alchemy URL
  wallet = new ethers.Wallet(privateKey, provider);
  donationContract = new ethers.Contract(
    doncationContractAddress,
    DonationContract.abi,
    wallet
  );
  userProfileContract = new ethers.Contract(
    userProfileContractAddress,
    UserProfileContract.abi,
    wallet
  );
} catch (err) {
  console.log("Please refer .env.example and readme to set your api keys");
}

app.post("/upload", upload.single("file"), async (req, res) => {
  const path = req.file.path;
  const files = await filesFromPaths([path]);

  const client = await create();
  await client.login(email);
  await client.setCurrentSpace(key);

  const directoryCid = await client.uploadDirectory(files);
  console.log(directoryCid);
  const cidString = directoryCid.toString();
  res.status(200).json({ cid: cidString });
});

app.get("/claimPrize", async (req, res) => {
  console.log("claimPrize");
  const userAddress = req.query.address;

  try {
    const tx = await donationContract.claimPrizeV2(userAddress);
    await tx.wait();

    const tx2 = await userProfileContract.resetScore(userAddress);
    await tx2.wait();

    res
      .status(200)
      .json({ status: "ok", message: "Prize claimed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error claiming prize" });
  }
});

async function transferToNGOs() {
  try {
    // hardcoding the address for now
    const tx = await donationContract.transferToNGO(
      "0x43a12e3647FD7c9eE99524eB0361755e93D2A760"
    );
    const receipt = await tx.wait();
    //console.log("Transaction receipt:", receipt);
    console.log("Donation to: ", receipt.to);
  } catch (error) {
    console.error("Error:", error);
  }
}

if (fundDistributionNode) setInterval(transferToNGOs, 15 * 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
