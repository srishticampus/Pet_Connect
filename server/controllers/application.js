import express from "express";
import Application from "../models/application.js"; // Assuming you have an Application model
import User from "../models/user.js"; // Assuming you have a User model
import Pets from "../models/pets.js"; // Assuming you have a Pets model
import auth from "../middleware/auth.js"; // Import authentication middleware

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

// Create a new adoption application
router.post("/adopt/:petId", auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const { message, confirmAdoption } = req.body;
    const adopterId = req.user._id; // Assuming user info is in req.user

    // Basic validation
    if (!message || confirmAdoption !== true) {
      return res.status(400).json({ message: "Message and confirmation are required." });
    }

    // Check if pet exists and get organization ID
    const pet = await Pets.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    // Create new application
    const newApplication = new Application({
      applicant: adopterId, // Adopter's user ID
      pet: petId,
      owner: pet.petOwner, // Owner managing the pet
      applicationType: 'adoption', // Type of application
      message,
      status: 'pending', // Initial status
    });

    await newApplication.save();

    res.status(201).json({ message: "Adoption application submitted successfully!", application: newApplication });
  } catch (err) {
    console.error("Error submitting adoption application:", err);
    res.status(500).json({ message: "Failed to submit adoption application.", error: err.message });
  }
});