// server/controllers/admin/pet-owners.js
const User = require('../../models/user');

const getAllPetOwners = async (req, res) => {
  try {
    const petOwners = await User.find({ role: 'pet-owner' });
    res.status(200).json(petOwners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pet owners' });
  }
};

module.exports = {
  getAllPetOwners,
};