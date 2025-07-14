import Pets from '../../models/pets.js';
import Report from '../../models/report.js'; // Import the Report model
import User from '../../models/user.js'; // Import the User model
import { validationResult } from 'express-validator'; // Will use later for validation

// Get all lost/found reports relevant to the authenticated pet owner
export const getLostFoundReportsForPetOwner = async (req, res) => {
  try {
    // Get IDs of pets owned by the current pet owner
    const ownerPetIds = await Pets.find({ petOwner: req.user.id }).distinct('_id');

    // Get IDs of all rescue shelters
    const rescueShelterUsers = await User.find({ role: 'rescue-shelter' }).distinct('_id');

    // Find reports where:
    // 1. The reportType is 'found' AND the matchedPet belongs to the current pet owner
    // 2. The reportingUser is the current pet owner (for reports they made)
    // 3. The reportType is 'found' AND the reportingUser is a rescue shelter
    const reports = await Report.find({
      $or: [
        { reportType: 'found', matchedPet: { $in: ownerPetIds } },
        { reportingUser: req.user.id },
        { reportType: 'found', reportingUser: { $in: rescueShelterUsers } } // Include found reports made by rescue shelters
      ]
    })
    .populate('reportingUser', '-password -__v') // Populate reporter's basic info
    .populate('matchedPet'); // Populate matched pet's basic info

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching lost/found reports for pet owner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all lost pets for the authenticated pet owner
export const getOwnerLostPets = async (req, res) => {
  try {
    const lostPets = await Pets.find({ petOwner: req.user.id, status: 'lost' });
    res.status(200).json(lostPets);
  } catch (error) {
    console.error('Error fetching owner lost pets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single lost pet by ID for the authenticated pet owner
export const getLostPetById = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pets.findOne({ _id: id, petOwner: req.user.id, status: { $in: ['lost', 'found'] } });

    if (!pet) {
      return res.status(404).json({ message: 'Lost pet not found or does not belong to you' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Error fetching lost pet by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Add a new lost pet
export const addLostPet = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { name, species, breed, size, age, gender, shortDescription, description, healthVaccinations, location, lostDate } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null; // Get the file path if a file was uploaded

  try {
    const newLostPet = new Pets({
      name,
      Species: species,
      Breed: breed,
      Size: size,
      Age: age,
      Gender: gender,
      shortDescription,
      description,
      healthVaccinations: healthVaccinations ? healthVaccinations.split(',').map(item => item.trim()).filter(item => item !== '') : [], // Split comma-separated health/vaccinations
      Location: location,
      Photo: photoPath, // Save the file path
      petOwner: req.user.id, // Associate with the authenticated user
      origin: 'owner', // Origin is owner
      status: 'lost', // Set status to lost
      lostDate: lostDate, // Add lostDate
    });

    const pet = await newLostPet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error adding lost pet:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a lost pet
export const editLostPet = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { id } = req.params;
  const updates = { ...req.body }; // Create a mutable copy

  // Handle photo update if a new file is uploaded
  if (req.file) {
    updates.Photo = `/uploads/${req.file.filename}`;
  }

  // Handle healthVaccinations string to array conversion
  if (updates.healthVaccinations && typeof updates.healthVaccinations === 'string') {
    updates.healthVaccinations = updates.healthVaccinations.split(',').map(item => item.trim()).filter(item => item !== '');
  }

  try {
    const pet = await Pets.findOneAndUpdate(
      { _id: id, petOwner: req.user.id, status: { $in: ['lost', 'found'] } }, // Ensure the pet belongs to the user and is lost or found
      { $set: updates },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ message: 'Lost pet not found or does not belong to you' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Error editing lost pet:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark a lost pet as found
export const markPetAsFound = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pets.findOneAndUpdate(
      { _id: id, petOwner: req.user.id, status: 'lost' }, // Ensure the pet belongs to the user and is lost
      { $set: { status: 'found' } },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ message: 'Lost pet not found or does not belong to you' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Error marking pet as found:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
