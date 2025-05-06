import Pets from '../../models/pets.js';
import { validationResult } from 'express-validator'; // Will use later for validation

// Get all lost pets for the authenticated pet owner
export const getLostPets = async (req, res) => {
  try {
    const lostPets = await Pets.find({ petOwner: req.user.id, status: 'lost' });
    res.status(200).json(lostPets);
  } catch (error) {
    console.error('Error fetching lost pets:', error);
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

  const { name, species, breed, size, age, gender, shortDescription, description, healthVaccinations, location } = req.body;
  const photoPath = req.file ? req.file.path : null; // Get the file path if a file was uploaded

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
      healthVaccinations: healthVaccinations.split(',').map(item => item.trim()).filter(item => item !== ''), // Split comma-separated health/vaccinations
      Location: location,
      Photo: photoPath, // Save the file path
      petOwner: req.user.id, // Associate with the authenticated user
      origin: 'owner', // Origin is owner
      status: 'lost', // Set status to lost
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
  const updates = req.body;

  try {
    const pet = await Pets.findOneAndUpdate(
      { _id: id, petOwner: req.user.id, status: 'lost' }, // Ensure the pet belongs to the user and is lost
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