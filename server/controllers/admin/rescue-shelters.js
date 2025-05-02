import User from "../../models/user";
import { body, validationResult } from 'express-validator';

const getAllRescueShelters = async (req, res) => {
  try {
    const rescueShelters = await User.find({ role: 'rescue-shelter' });
    res.status(200).json(rescueShelters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch rescue shelters' });
  }
};

const approveRescueShelter = async (req, res) => {
  try {
    const { id } = req.params;

    const rescueShelter = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true } // Return the updated document
    );

    if (!rescueShelter) {
      return res.status(404).json({ message: 'Rescue Shelter not found' });
    }

    res.status(200).json({ message: 'Rescue Shelter approved successfully', rescueShelter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve rescue shelter' });
  }
};

const rejectRescueShelter = async (req, res) => {
  try {
    const { id } = req.params;

    const rescueShelter = await User.findByIdAndDelete(id);

    if (!rescueShelter) {
      return res.status(404).json({ message: 'Rescue Shelter not found' });
    }

    res.status(200).json({ message: 'Rescue Shelter rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject rescue shelter' });
  }
};

const getApprovedRescueShelters = async (req, res) => {
  try {
    const approvedRescueShelters = await User.find({ role: 'rescue-shelter', isApproved: true });
    res.status(200).json(approvedRescueShelters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch approved rescue shelters' });
  }
};


export { getAllRescueShelters, approveRescueShelter, rejectRescueShelter, getApprovedRescueShelters };