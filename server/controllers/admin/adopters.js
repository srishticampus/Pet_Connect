import User from "../../models/user";
import { body, validationResult } from 'express-validator';

const getAllAdopters = async (req, res) => {
  try {
    const adopters = await User.find({ role: 'adopter' });
    res.status(200).json(adopters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch adopters' });
  }
};

const approveAdopter = async (req, res) => {
  try {
    const { id } = req.params;

    const adopter = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true } // Return the updated document
    );

    if (!adopter) {
      return res.status(404).json({ message: 'Adopter not found' });
    }

    res.status(200).json({ message: 'Adopter approved successfully', adopter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve adopter' });
  }
};

const rejectAdopter = async (req, res) => {
  try {
    const { id } = req.params;

    const adopter = await User.findByIdAndDelete(id);

    if (!adopter) {
      return res.status(404).json({ message: 'Adopter not found' });
    }

    res.status(200).json({ message: 'Adopter rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject adopter' });
  }
};

const getApprovedAdopters = async (req, res) => {
  try {
    const approvedAdopters = await User.find({ role: 'adopter', isApproved: true });
    res.status(200).json(approvedAdopters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch approved adopters' });
  }
};


export { getAllAdopters, approveAdopter, rejectAdopter, getApprovedAdopters };