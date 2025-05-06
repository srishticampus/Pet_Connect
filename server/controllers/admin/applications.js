import express from "express";
import Application from "../../models/application.js";
import Pets from "../../models/pets.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// Get all applications (Admin only)
router.get("/", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin access required." });
    }

    const applications = await Application.find()
      .populate('applicant', 'name email') // Populate applicant details
      .populate('pet', 'name Photo Breed'); // Populate pet details

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Failed to fetch applications.", error: err.message });
  }
});

// Approve an application (Admin only)
router.put("/:applicationId/approve", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin access required." });
    }

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.status !== 'pending') {
        return res.status(400).json({ message: `Application is already ${application.status}.` });
    }

    application.status = 'approved';
    application.markModified('owner'); // Explicitly mark owner as modified
    await application.save();

    // Update pet owner
    const pet = await Pets.findById(application.pet);
    if (!pet) {
        // This should ideally not happen if application refers to a valid pet
        console.error(`Pet with ID ${application.pet} not found for application ${application._id}`);
        return res.status(404).json({ message: "Associated pet not found." });
    }

    pet.petOwner = application.applicant; // Assign pet to the applicant
    pet.availableForAdoptionOrFoster = false; // Mark pet as not available for adoption
    await pet.save();

    res.json({ message: "Application approved successfully!", application });
  } catch (err) {
    console.error("Error approving application:", err);
    res.status(500).json({ message: "Failed to approve application.", error: err.message });
  }
});

// Reject an application (Admin only)
router.put("/:applicationId/reject", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin access required." });
    }

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.status !== 'pending') {
        return res.status(400).json({ message: `Application is already ${application.status}.` });
    }

    application.status = 'rejected';
    await application.save();

    res.json({ message: "Application rejected successfully!", application });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ message: "Failed to reject application.", error: err.message });
  }
});

export default router;