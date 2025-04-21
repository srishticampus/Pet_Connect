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

async function createUserAdmin() {
  const rl = readline.createInterface({ input, output });

  const name = await rl.question("Name: ");
  const email = await rl.question("Email: ");
  const password = await rl.question("Password: ");

  rl.close();

  try {
    await mongoose.connect(
      process?.env?.VITE_MONGO_URI || "mongodb://localhost:27017/petconnect",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    // Delete existing user with the same email
    await UserModel.deleteOne({ email: email });

    const hashedPassword = await hash(password);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createUserAdmin();
