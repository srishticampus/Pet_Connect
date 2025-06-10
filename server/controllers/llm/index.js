import express from 'express';
import { generatePetDescription } from '../llm.js';

const router = express.Router();

router.post('/generate-pet-description', generatePetDescription);

export default router;
