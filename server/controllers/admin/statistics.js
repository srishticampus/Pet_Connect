import mongoose from 'mongoose';

const getUserStats = async (req, res) => {
  try {
    const userCount = await mongoose.model('User').countDocuments();
    console.log('User count:', userCount);
    res.status(200).json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user statistics' });
  }
};

const getPetStats = async (req, res) => {
  try {
    const petCount = await mongoose.model('Pets').countDocuments();
    console.log('Pet count:', petCount);
    res.status(200).json({ petCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pet statistics' });
  }
};

const getAdopterStats = async (req, res) => {
  try {
    const adopterCount = await mongoose.model('User').countDocuments({ role: 'adopter' });
    console.log('Adopter count:', adopterCount);
    res.status(200).json({ adopterCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch adopter statistics' });
  }
};

const getApplicationStats = async (req, res) => {
  try {
    const applicationCount = await mongoose.model('Application').countDocuments();
    console.log('Application count:', applicationCount);
    res.status(200).json({ applicationCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch application statistics' });
  }
};

const getDocumentStats = async (req, res) => {
  try {
    const documentCount = await mongoose.model('Document').countDocuments();
    console.log('Document count:', documentCount);
    res.status(200).json({ documentCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch document statistics' });
  }
};

const getFosterStats = async (req, res) => {
  try {
    const fosterCount = await mongoose.model('User').countDocuments({ role: 'foster' });
    console.log('Foster count:', fosterCount);
    res.status(200).json({ fosterCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch foster statistics' });
  }
};

const getLostFoundPetStats = async (req, res) => {
  try {
    const lostFoundPetCount = await mongoose.model('Report').countDocuments();
    console.log('Lost and Found Pet count:', lostFoundPetCount);
    res.status(200).json({ lostFoundPetCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch lost and found pet statistics' });
  }
};

const getPetOwnerStats = async (req, res) => {
  try {
    const petOwnerCount = await mongoose.model('User').countDocuments({ role: 'pet_owner' });
    console.log('Pet Owner count:', petOwnerCount);
    res.status(200).json({ petOwnerCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pet owner statistics' });
  }
};

const getRescueShelterStats = async (req, res) => {
  try {
    const rescueShelterCount = await mongoose.model('User').countDocuments({ role: 'rescue-shelter' });
    console.log('Rescue Shelter count:', rescueShelterCount);
    res.status(200).json({ rescueShelterCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch rescue shelter statistics' });
  }
};

export {
  getUserStats,
  getPetStats,
  getAdopterStats,
  getApplicationStats,
  getDocumentStats,
  getFosterStats,
  getLostFoundPetStats,
  getPetOwnerStats,
  getRescueShelterStats,
};
