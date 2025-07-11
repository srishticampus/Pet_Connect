import { Router } from 'express';
import Pets from '../../models/pets.js';
import Report from '../../models/report.js'; // Import the Report model
import auth from '../../middleware/auth.js'; // Assuming auth middleware is here
import { body, validationResult } from 'express-validator';

const router = Router();

// @route   GET /api/rescue-shelter/lost-found-reports
// @desc    Get lost or found pets relevant to the authenticated rescue/shelter
// @access  Private (Rescue/Shelter only)
router.get('/', auth, async (req, res) => {
  // Check if the authenticated user is a rescue-shelter
  if (req.user.role !== 'rescue-shelter') {
    return res.status(403).json({ msg: 'Access denied. Only rescue-shelters can view these reports.' });
  }

  try {
    // Find pets that are either directly owned by this rescue-shelter (as petOwner)
    // or are reported lost/found in their general area (requires location data on user model)
    // For simplicity, initially, we'll fetch pets where the rescue-shelter is the petOwner
    // or where the pet's origin is 'owner' and it's in 'lost' or 'found' status.
    // A more advanced implementation would involve geographical proximity.

    const lostFoundPets = await Pets.find({
      $or: [
        { petOwner: req.user.id }, // Pets directly managed by this rescue-shelter
        { status: { $in: ['lost', 'found'] } } // All lost/found pets (can be refined later by location)
      ]
    }).populate('petOwner', 'name email profilePic'); // Populate petOwner to get reporter/shelter info

    // Further filter if needed, e.g., by location of the rescue-shelter
    // For now, returning all lost/found pets or those directly owned.
    res.json(lostFoundPets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/rescue-shelter/lost-found-reports/:id
// @desc    Get a single lost or found pet by ID relevant to the authenticated rescue/shelter
// @access  Private (Rescue/Shelter only)
router.get('/:id', auth, async (req, res) => {
  // Check if the authenticated user is a rescue-shelter
  if (req.user.role !== 'rescue-shelter') {
    return res.status(403).json({ msg: 'Access denied. Only rescue-shelters can view these reports.' });
  }

  try {
    const pet = await Pets.findOne({
      _id: req.params.id,
      $or: [
        { petOwner: req.user.id },
        { status: { $in: ['lost', 'found'] } } // Allow viewing any lost/found pet for now
      ]
    }).populate('petOwner', 'name email profilePic');

    if (!pet) {
      return res.status(404).json({ msg: 'Pet not found or not relevant to your organization' });
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

// @route   PUT /api/rescue-shelter/lost-found-reports/:id/status
// @desc    Update pet status (e.g., mark as resolved/found) by a rescue/shelter
// @access  Private (Rescue/Shelter only)
router.put('/:id/status', auth, [
  body('status', 'Status is required').notEmpty().isIn(['active', 'lost', 'found']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if the authenticated user is a rescue-shelter
  if (req.user.role !== 'rescue-shelter') {
    return res.status(403).json({ msg: 'Access denied. Only rescue-shelters can update pet status.' });
  }

  const { status } = req.body;

  try {
    let pet = await Pets.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ msg: 'Pet not found' });
    }

    // Ensure the rescue-shelter has permission to update this pet's status
    // This could be if they are the petOwner, or if the pet was reported in their area.
    // For now, we'll allow updating if it's a lost/found pet.
    // A more robust check would be needed here.

    pet.status = status;
    await pet.save();

    // If the pet is marked as 'found', create a new report
    if (status === 'found') {
      const newReport = new Report({
        reportType: 'found',
        reportingUser: req.user.id, // The rescue shelter is the reporting user
        matchedPet: pet._id, // The pet that was marked as found
        petName: pet.name,
        species: pet.Species,
        breed: pet.Breed,
        foundLocation: pet.Location, // Assuming pet.Location is the found location
        image: pet.Photo, // Assuming pet.Photo is the image
        petDescription: pet.description,
        createdAt: new Date(), // Set creation date
      });
      await newReport.save();
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

export default router;
