import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

import { create } from "@web3-storage/w3up-client";
import { filesFromPaths } from "files-from-path";

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
