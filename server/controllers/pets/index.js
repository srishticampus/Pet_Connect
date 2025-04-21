import express from "express";
import { body, validationResult } from "express-validator";
import Pets from "../../models/pets.js";
import auth from "../../middleware/auth.js"; // Import the auth middleware
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/pet-images')); // Destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Filename
  }
});

const upload = multer({ storage: storage });

// Create a new pet with image upload
router.post(
  "/upload",
  auth, // Add auth middleware
  upload.single('image'), // 'image' is the name of the file field in the form
  async (req, res, next) => {
    try {
      if (req.body.healthVaccinations) {
        req.body.healthVaccinations = JSON.parse(req.body.healthVaccinations);
      }
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Invalid healthVaccinations format' });
    }
  },
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
      const { name, species, shortDescription, age, gender, breed, size, description, origin, healthVaccinations } = req.body;
      let imagePath = null;
      if (req.file) {
        imagePath = '/uploads/' + req.file.filename; // Save the path to the image
      }

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
        Photo: imagePath, // Save the image path to the database
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
