import express from "express";
import { router as authRouter } from "./auth/index.js";
import { router as profileRouter } from "./profile/index.js";
import { router as petsRouter } from "./pets/index.js";
import {router as contactRouter} from "./contact.js";
import { router as applicationRouter } from "./application.js"; // Import application routes
import fosterRouter from "./foster.js"; // Import foster router

const router = express.Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/pets", petsRouter);
router.use("/contact", contactRouter);
router.use("/applications", applicationRouter); // Use application routes
router.use("/foster", fosterRouter); // Use foster router

export default router;
