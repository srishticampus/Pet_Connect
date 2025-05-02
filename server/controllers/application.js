import express from "express";
import Application from "../models/application.js"; // Assuming you have an Application model
import User from "../models/user.js"; // Assuming you have a User model
import Pets from "../models/pets.js"; // Assuming you have a Pets model

export const router = express.Router();

// Get application details by ID
router.get("/:applicationId", async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('foster', 'name image email phoneNumber aadharNumber place') // Populate foster details
      .populate('pet', 'Photo Breed Species Size Age') // Populate pet details
      .populate({ // Populate rescue/shelter details through the pet
        path: 'pet',
        populate: {
          path: 'petOwner', // Assuming petOwner in Pets model links to User/Organization
          select: 'name email phoneNumber place' // Select relevant fields
        }
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Restructure the response to match the frontend component's expectation
    const responseData = {
      foster: application.foster,
      pet: application.pet,
      rescueShelter: application.pet?.petOwner // Assuming petOwner is the rescue/shelter
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});