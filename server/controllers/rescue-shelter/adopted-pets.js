import express from 'express';
import Pet from '../../models/pets.js'; // Adjust path as necessary
import auth from '../../middleware/auth.js'; // Assuming auth middleware

const router = express.Router();

// @route   GET /api/rescue-shelter/adopted-pets
// @desc    Get all adopted pets for the authenticated rescue shelter
// @access  Private (Rescue Shelter only)
router.get('/', auth, async (req, res) => {
  try {
    // Ensure the authenticated user is a rescue shelter
    if (req.user.role !== 'rescue-shelter') {
      return res.status(403).json({ message: 'Not authorized as a rescue shelter' });
    }

    const adoptedPets = await Pet.find({
      organization: req.user.id,
      isAdopted: true,
      status: 'adopted',
      status: { $ne: 'fostered' },
    }).populate('petOwner', 'name'); // Populate petOwner details if needed

    res.status(200).json(adoptedPets);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
