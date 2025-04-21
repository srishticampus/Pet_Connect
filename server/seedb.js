import mongoose from "mongoose";
import { hash } from "argon2";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import UserModel from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
await mongoose.connect(
    process?.env?.VITE_MONGO_URI || "mongodb://localhost:27017/petconnect",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
//view all users
console.log("Users");
  const users = await UserModel.find();
  console.log(users);

// view all pet owners
console.log("Pet Owners");
  const petOwners = await UserModel.find({ role: "pet_owner" });
  console.log(petOwners);

  await mongoose.disconnect();
