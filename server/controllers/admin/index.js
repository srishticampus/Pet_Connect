// server/controllers/admin/index.js
import express from 'express';
import { getAllPetOwners } from './pet-owners';
const router = express.Router();

router.get('/pet-owners', getAllPetOwners);

export default router;