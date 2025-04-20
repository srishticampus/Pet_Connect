import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import cookieParser from "cookie-parser";

import "./db_driver";
import apiRouter from "./controllers";
import adminRouter from "./controllers/admin"; // Import admin routes

export const app = express();

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

console.log(import.meta.env.PROD,import.meta.env.VITE_JWT_SECRET,import.meta.env.VITE_MONGO_URI,import.meta.env.VITE_CLIENT_URL);
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Root route (public, no CSRF here)
app.get("/", (req, res) => {
  res.send("Expresssss");
});

// API routes
app.use("/api", apiRouter);
app.use("/api/admin", adminRouter); // Use admin routes

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Server listen (only if run directly, not during tests)
if (import.meta.env.PROD) {
  const PORT = import.meta.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
