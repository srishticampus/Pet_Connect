import User from "../../models/user";
import { body, validationResult } from 'express-validator';

const getAllPetOwners = async (req, res) => {
  try {
    const petOwners = await User.find({ role: 'pet_owner' });
    res.status(200).json(petOwners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pet owners' });
  }
};

const addPetOwnerValidationRules = () => {
  return [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

const addPetOwner = async (req, res) => {
  await Promise.all(addPetOwnerValidationRules().map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'pet-owner',
    });

    await user.save();
    res.status(201).json({ message: 'Pet owner created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create pet owner' });
  }
};

const updatePetOwnerValidationRules = () => {
    return [
      body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
      body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
      body('email').optional().isEmail().withMessage('Invalid email address'),
      body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];
  };

const updatePetOwner = async (req, res) => {
    await Promise.all(updatePetOwnerValidationRules().map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'Pet owner not found' });
    }

    res.status(200).json({ message: 'Pet owner updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update pet owner' });
  }
};

const deletePetOwner = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'Pet owner not found' });
    }

    res.status(200).json({ message: 'Pet owner deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete pet owner' });
  }
};

export { getAllPetOwners, addPetOwner, updatePetOwner, deletePetOwner };