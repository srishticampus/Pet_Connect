import express from "express";
import { router as authRouter } from "./auth/index.js";
import { router as profileRouter } from "./profile/index.js";
import { router as petsRouter } from "./pets/index.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/pets", petsRouter);

export default router;
