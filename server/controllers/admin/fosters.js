import User from "../../models/user";
import { body, validationResult } from 'express-validator';

const getAllFosters = async (req, res) => {
  try {
    const fosters = await User.find({ role: 'foster' });
    res.status(200).json(fosters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch fosters' });
  }
};

const approveFoster = async (req, res) => {
  try {
    const { id } = req.params;

    const foster = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true } // Return the updated document
    );

    if (!foster) {
      return res.status(404).json({ message: 'Foster not found' });
    }

    res.status(200).json({ message: 'Foster approved successfully', foster });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve foster' });
  }
};

const rejectFoster = async (req, res) => {
  try {
    const { id } = req.params;

    const foster = await User.findByIdAndDelete(id);

    if (!foster) {
      return res.status(404).json({ message: 'Foster not found' });
    }

    res.status(200).json({ message: 'Foster rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject foster' });
  }
};

const getApprovedFosters = async (req, res) => {
  try {
    const approvedFosters = await User.find({ role: 'foster', isApproved: true });
    res.status(200).json(approvedFosters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch approved fosters' });
  }
};


export { getAllFosters, approveFoster, rejectFoster, getApprovedFosters };