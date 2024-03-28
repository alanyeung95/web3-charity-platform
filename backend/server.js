import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import ethers from "ethers";

import { create } from "@web3-storage/w3up-client";
import { filesFromPaths } from "files-from-path";

import DonationContract from "../src/artifacts/contracts/DonationContract.sol/DonationContract.json" assert { type: "json" };

dotenv.config();

const email = process.env.WEB3_STORAGE_EMAIL;
const key = process.env.WEB3_STORAGE_KEY;

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

/*
app.post("/test", async (req, res) => {
  res.status(200);
});
*/

async function transferToNGOs() {
  const privateKey = process.env.METAMASK_PRIVATE_KEY;
  const contractAddress = process.env.DONATION_CONTRACT_ADDRESS;
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // e.g., Infura/Alchemy URL
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    contractAddress,
    DonationContract.abi,
    wallet
  );

  try {
    // hardcoding the address for now
    const tx = await contract.transferToNGO(
      "0x43a12e3647FD7c9eE99524eB0361755e93D2A760"
    );
    const receipt = await tx.wait();
    //console.log("Transaction receipt:", receipt);
    console.log("Donation to: ", receipt.to);
  } catch (error) {
    console.error("Error:", error);
  }
}

setInterval(transferToNGOs, 15 * 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
