import express from "express";
import { router as authRouter } from "./auth/index.js";
import { router as profileRouter } from "./profile/index.js";
import { router as petsRouter } from "./pets/index.js";
import {router as contactRouter} from "./contact.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/pets", petsRouter);
router.use("/contact", contactRouter);


export default router;
