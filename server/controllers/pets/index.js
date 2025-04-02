import express from "express";
import { body, validationResult } from "express-validator";
import Pets from "./models/pet.js";

const router = express.Router();

// Create a new pet
router.post(
  "/pets",
  [body("Species").notEmpty().withMessage("Species is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newPet = new Pets(req.body);
      const savedPet = await newPet.save();
      res.status(201).json(savedPet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

// Get all pets
router.get("/pets", async (req, res) => {
  try {
    const pets = await Pets.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific pet by ID
router.get("/pets/:id", async (req, res) => {
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
router.patch("/pets/:id", async (req, res) => {
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
router.delete("/pets/:id", async (req, res) => {
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

export default router;
