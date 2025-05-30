import { Router } from 'express';
import Pets from '../../models/pets.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get all lost or found pets
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status === 'lost' || status === 'found') {
      query.status = status;
    } else {
      query.status = { $in: ['lost', 'found'] };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive
      query.$or = [
        { name: { $regex: searchRegex } },
        { Breed: { $regex: searchRegex } },
        { Species: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    const lostFoundPets = await Pets.find(query).populate('organization petOwner');
    res.json(lostFoundPets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single lost or found pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pets.findOne({ _id: req.params.id, status: { $in: ['lost', 'found'] } }).populate('organization petOwner');

    if (!pet) {
      return res.status(404).json({ msg: 'Pet not found or not in lost/found status' });
    }

    res.json(pet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Pet not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Update pet status (e.g., mark as found)
router.put('/:id/status', [
  body('status', 'Status is required').notEmpty().isIn(['active', 'lost', 'found']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status } = req.body;

  try {
    let pet = await Pets.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ msg: 'Pet not found' });
    }

    pet.status = status;
    await pet.save();

    res.json(pet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Pet not found' });
    }
    res.status(500).send('Server Error');
  }
});


export default router;
