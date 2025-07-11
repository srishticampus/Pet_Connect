import express from "express";
import Application from "../models/application.js"; // Assuming you have an Application model
import User from "../models/user.js"; // Assuming you have a User model
import Pets from "../models/pets.js"; // Assuming you have a Pets model
import auth from "../middleware/auth.js"; // Import authentication middleware

export const router = express.Router();

// Get applications for pets owned by the authenticated user (Rescue Shelter only)
router.get("/owned", auth, async (req, res) => {
  try {
    // Check if user is a rescue shelter
    if (req.userType !== 'rescue-shelter') {
      return res.status(403).json({ message: "Access denied. Rescue Shelter access required." });
    }

    console.log("Fetching owned applications for user:", req.user._id);
    // Find pets owned by the authenticated user
    const ownedPets = await Pets.find({ petOwner: req.user._id }).select('_id');
    console.log("Found owned pets:", ownedPets.length);
    const ownedPetIds = ownedPets.map(pet => pet._id);
    console.log("Owned pet IDs:", ownedPetIds);

    // Find applications for these pets
    console.log("Finding applications for owned pet IDs...");
    const applications = await Application.find({ pet: { $in: ownedPetIds } })
      .populate('applicant', 'name email phoneNumber aadharNumber place aadhaarImage') // Populate applicant details
      .populate('pet', 'name Photo Breed Age Gender Size'); // Populate pet details
    console.log("Found applications:", applications.length);
    // Log applicant data for each application to check for aadharNumber
    applications.forEach(app => {
      console.log("Applicant data for application", app._id, ":", JSON.stringify(app.applicant, null, 2));
    });
    console.log("Applications data being sent:", JSON.stringify(applications, null, 2));

    res.json(applications);
  } catch (err) {
    console.error("Error fetching owned applications:", err);
    res.status(500).json({ message: "Failed to fetch owned applications.", error: err.message });
  }
});

// Get adoption applications for the authenticated adopter user
router.get("/my-adoptions", auth, async (req, res) => {
  try {
    // Check if user is an adopter
    if (req.userType !== 'adopter') {
      return res.status(403).json({ message: "Access denied. Adopter access required." });
    }

    const applications = await Application.find({
      applicant: req.user._id,
      applicationType: 'adoption',
    }).populate('pet', ['name', 'Species', 'Breed', 'Gender', 'Size', 'Photo', 'Age']); // Populate pet details

    res.json(applications);
  } catch (err) {
    console.error("Error fetching adopter's applications:", err);
    res.status(500).json({ message: "Failed to fetch adopter's applications.", error: err.message });
  }
});

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

// Approve an application by the pet owner (Rescue Shelter only)
router.put("/:applicationId/approve-by-owner", auth, async (req, res) => {
  try {
    // Check if user is a rescue shelter
    if (req.userType !== 'rescue-shelter') {
      return res.status(403).json({ message: "Access denied. Rescue Shelter access required." });
    }

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Verify that the authenticated user is the owner of the pet associated with the application
    if (!application.owner.equals(req.user._id)) {
         return res.status(403).json({ message: "Access denied. You do not own this pet's application." });
    }


    if (application.status !== 'pending') {
        return res.status(400).json({ message: `Application is already ${application.status}.` });
    }

    application.status = 'approved';
    await application.save();

    // Update pet owner and availability
    const pet = await Pets.findById(application.pet);
    if (!pet) {
        console.error(`Pet with ID ${application.pet} not found for application ${application._id}`);
        return res.status(404).json({ message: "Associated pet not found." });
    }

    pet.petOwner = application.applicant; // Assign pet to the applicant
    pet.availableForAdoptionOrFoster = false; // Mark pet as not available
    pet.isAdopted = true; // Mark pet as adopted
    pet.status = 'adopted'; // Set pet status to adopted
    await pet.save();

    res.json({ message: "Application approved successfully!", application });
  } catch (err) {
    console.error("Error approving application by owner:", err);
    res.status(500).json({ message: "Failed to approve application.", error: err.message });
  }
});

// Reject an application by the pet owner (Rescue Shelter only)
router.put("/:applicationId/reject-by-owner", auth, async (req, res) => {
  try {
    // Check if user is a rescue shelter
    if (req.userType !== 'rescue-shelter') {
      return res.status(403).json({ message: "Access denied. Rescue Shelter access required." });
    }

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

     // Verify that the authenticated user is the owner of the pet associated with the application
    if (!application.owner.equals(req.user._id)) {
         return res.status(403).json({ message: "Access denied. You do not own this pet's application." });
    }


    if (application.status !== 'pending') {
        return res.status(400).json({ message: `Application is already ${application.status}.` });
    }

    application.status = 'rejected';
    await application.save();

    res.json({ message: "Application rejected successfully!", application });
  } catch (err) {
    console.error("Error rejecting application by owner:", err);
    res.status(500).json({ message: "Failed to reject application.", error: err.message });
  }
});
