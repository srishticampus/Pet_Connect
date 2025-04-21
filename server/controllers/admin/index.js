// server/controllers/admin/index.js
import express from 'express';
import { getAllPetOwners, addPetOwner, updatePetOwner, deletePetOwner } from './pet-owners';
const router = express.Router();

router.get('/pet-owners', getAllPetOwners);
router.post('/pet-owners', addPetOwner);
router.put('/pet-owners/:id', updatePetOwner);
router.delete('/pet-owners/:id', deletePetOwner);

export default router;