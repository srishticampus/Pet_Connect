// server/controllers/admin/index.js
import express from 'express';
import { getAllPetOwners, addPetOwner, updatePetOwner, deletePetOwner } from './pet-owners.js';
import { getAllPets, addPet, updatePet, deletePet } from './pets.js';
import { getUserStats, getPetStats } from './statistics.js';

const router = express.Router();

router.get('/pet-owners', getAllPetOwners);
router.post('/pet-owners', addPetOwner);
router.put('/pet-owners/:id', updatePetOwner);
router.delete('/pet-owners/:id', deletePetOwner);

router.get('/pets', getAllPets);
router.post('/pets', addPet);
router.put('/pets/:id', updatePet);
router.delete('/pets/:id', deletePet);

router.get('/statistics/users', getUserStats);
router.get('/statistics/pets', getPetStats);

export default router;