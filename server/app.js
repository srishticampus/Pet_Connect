import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import cookieParser from "cookie-parser";
import csrf from "csurf";

import "./db_driver";
import apiRouter from "./controllers";
import adminRouter from "./controllers/admin"; // Import admin routes

export const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
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

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// CSRF protection setup (but don't apply globally)
const csrfProtection = csrf({
  cookie: {
    key: 'XSRF-TOKEN',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
  }
});

// Root route (public, no CSRF here)
app.get("/", (req, res) => {
  res.send("Expresssss");
});

// Apply CSRF protection only to API routes
app.use("/api", (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    csrfProtection(req, res, next);
  } else {
    next();
  }
});

// API routes
app.use("/api", apiRouter);
app.use("/api/admin", adminRouter); // Use admin routes

// Error handling
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Server listen (only if run directly, not during tests)
if (import.meta.env.PROD) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
