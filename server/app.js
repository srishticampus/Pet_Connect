import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import cookieParser from "cookie-parser";

import "./db_driver";
import apiRouter from "./controllers";
import adminRouter from "./controllers/admin"; // Import admin routes
import rescueShelterRouter from "./controllers/rescue-shelter"; // Import rescue-shelter routes
import llmRouter from "./controllers/llm/index.js"; // Import LLM routes
import mlRouter from "./controllers/ml/pet-detect.js"; // Import ML routes
import path from "path";
import { fileURLToPath } from "url";
export const app = express();
import fs from "fs";
import adminAuth from "./middleware/adminAuth.js"; // Import admin authentication middleware

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: import.meta.env.VITE_CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
// app.use(logger());

// create a rotating write stream for production logging
const accessLogStream = createStream("access.log", {
  interval: "1d", // rotate daily
  path: "./logs",
});

// console.log(import.meta.env.PROD,import.meta.env.VITE_JWT_SECRET,import.meta.env.VITE_MONGO_URI,import.meta.env.VITE_CLIENT_URL);
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Root route (public, no CSRF here)
app.get("/", (req, res) => {
  res.send("Express API. /api for API routes. The client is at "+import.meta.env.VITE_CLIENT_URL);
});

// API routes
app.use("/api", apiRouter);
app.use("/api/admin", adminAuth, adminRouter); // Apply authentication middleware to admin routes
app.use("/api/rescue-shelter", rescueShelterRouter); // Use rescue-shelter routes
app.use("/api/llm", llmRouter); // Use LLM routes
app.use("/api/ml", mlRouter); // Use LLM routes


//static files for uploads servedin /uploads url
// create uploads folder if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Server listen (only if run directly, not during tests)
if (import.meta.env.PROD) {
  const PORT = import.meta.env.VITE_PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
