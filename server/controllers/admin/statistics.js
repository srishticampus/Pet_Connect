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

export { getUserStats, getPetStats };