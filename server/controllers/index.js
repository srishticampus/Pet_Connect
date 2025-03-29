import express from "express";
import { router as authRouter } from "./auth/index.js";

const router = express.Router();

router.use("/auth", authRouter);

export default router;
