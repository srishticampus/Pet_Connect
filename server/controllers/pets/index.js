import express from "express";
import { body, validationResult } from "express-validator";
import Pets from "../../models/pets.js";
import auth from "../../middleware/auth.js"; // Import the auth middleware
export const router = express.Router();

// Create a new pet
router.post(
  "/",
  auth, // Add auth middleware
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("species").notEmpty().withMessage("Species is required"),
    body("shortDescription").notEmpty().withMessage("Short description is required"),
    body("age").isInt({ gt: 0 }).withMessage("Age must be a positive integer"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("breed").notEmpty().withMessage("Breed is required"),
    body("size").isIn(["small", "medium", "large"]).withMessage("Invalid size"),
    body("description").notEmpty().withMessage("Description is required"),
    body("healthVaccinations").isArray().withMessage("Health and vaccinations must be an array"),
    body("origin").isIn(["owner", "foster"]).withMessage("Invalid origin"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, species, shortDescription, age, gender, breed, size, description, healthVaccinations, image, origin } = req.body;
      const newPet = new Pets({
        name,
        Species: species, // Note the capitalization difference
        shortDescription,
        Age: age, // Note the capitalization difference
        Gender: gender, // Note the capitalization difference
        Breed: breed, // Note the capitalization difference
        Size: size, // Note the capitalization difference
        description,
        healthVaccinations,
        Photo: image, // Note the capitalization difference
        petOwner: req.userId, // Assuming req.userId is set by auth middleware
        origin,
      });
      const savedPet = await newPet.save();
      res.status(201).json(savedPet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

// Get all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pets.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific pet by ID
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pets.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a pet
router.patch("/:id", async (req, res) => {
  try {
    const pet = await Pets.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a pet
router.delete("/:id", async (req, res) => {
  try {
    const pet = await Pets.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json({ message: "Pet deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
