import express from "express";
import { router as authRouter } from "./auth/index.js";
import { router as profileRouter } from "./profile/index.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);

export default router;
