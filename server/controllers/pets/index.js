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
    cb(null, path.join(__dirname, '../../uploads')); // Destination folder
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
        organization: origin === 'foster' ? req.userId : undefined, // Set organization if origin is foster
        origin,
      });

      const savedPet = await newPet.save();
      res.status(201).json(savedPet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

// @route   GET /api/pets/species
// @desc    Get a list of distinct pet species
// @access  Public
router.get("/species", async (req, res) => {
  try {
    const species = await Pets.distinct("Species");
    res.json(species);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pets.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/pets/available-for-adoption
// @desc    Get all pets available for adoption or foster (not yet adopted)
// @access  Public
router.get("/available-for-adoption", async (req, res) => {
  try {
    const pets = await Pets.find({ availableForAdoptionOrFoster: true, isAdopted: false });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/pets/adopted
// @desc    Get all pets that have been adopted
// @access  Public (or Private, depending on requirements, but client side assumes public for now)
router.get("/adopted", async (req, res) => {
  try {
    const pets = await Pets.find({ isAdopted: true });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific pet by ID
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pets.findById(req.params.id).populate('petOwner', 'name email profilePic'); // Populate petOwner
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/pets/rescue-shelter/my-pets
// @desc    Get all pets for the authenticated rescue/shelter user
// @access  Private (Rescue/Shelter only)
router.get("/rescue-shelter/my-pets", auth, async (req, res) => {
    // Check if the authenticated user is a rescue-shelter
    if (req.userType !== 'rescue-shelter') {
        return res.status(403).json({ message: 'Unauthorized: Only rescue-shelters can view their pets.' });
    }

    try {
        const pets = await Pets.find({ petOwner: req.userId, origin: 'rescue-shelter' });
        res.json(pets);
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

// @route   GET /api/pets/rescue-shelter/:id
// @desc    Get a specific pet by ID for the authenticated rescue/shelter user
// @access  Private (Rescue/Shelter only)
router.get("/rescue-shelter/:id", auth, async (req, res) => {
    console.log(`Attempting to fetch pet with ID: ${req.params.id} for user: ${req.userId}`); // Log for validation
    // Check if the authenticated user is a rescue-shelter
    if (req.userType !== 'rescue-shelter') {
        console.log('Unauthorized attempt to access rescue-shelter pet by non-rescue-shelter user.'); // Log for validation
        return res.status(403).json({ message: 'Unauthorized: Only rescue-shelters can view their pets this way.' });
    }

    try {
        const petId = req.params.id;

        // Find the pet by ID and petOwner ID to ensure ownership
        const pet = await Pets.findOne({ _id: petId, petOwner: req.userId });

        if (!pet) {
            console.log(`Pet with ID: ${petId} not found or not owned by user: ${req.userId}`); // Log for validation
            return res.status(404).json({ message: "Pet not found or you do not have permission to view this pet." });
        }

        console.log(`Successfully fetched pet with ID: ${petId}`); // Log for validation
        res.json(pet);
    } catch (err) {
        console.error(`Error fetching pet with ID: ${req.params.id}`, err); // Log for validation
        res.status(500).json({ message: err.message });
    }
});


// @route   POST /api/pets/rescue-shelter
// @desc    Add a new pet by a rescue/shelter
// @access  Private (Rescue/Shelter only)
router.post(
  "/rescue-shelter",
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
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the authenticated user is a rescue-shelter
    if (req.userType !== 'rescue-shelter') {
        return res.status(403).json({ message: 'Unauthorized: Only rescue-shelters can add pets this way.' });
    }

    try {
      const { name, species, shortDescription, age, gender, breed, size, description, healthVaccinations } = req.body;
      let imagePath = null;
      if (req.file) {
        imagePath = '/uploads/' + req.file.filename; // Save the path to the image
      }

      const newPet = new Pets({
        name,
        Species: species,
        shortDescription,
        Age: age,
        Gender: gender,
        Breed: breed,
        Size: size,
        description,
        healthVaccinations,
        Photo: imagePath,
        petOwner: req.userId, // Associate pet with the rescue/shelter user
        organization: req.userId, // Associate organization with the rescue/shelter user
        origin: 'rescue-shelter', // Set origin to rescue-shelter
        availableForAdoptionOrFoster: true, // Mark as available for adoption/foster
      });

      const savedPet = await newPet.save();
      res.status(201).json(savedPet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

// @route   PATCH /api/pets/rescue-shelter/:id
// @desc    Edit a pet by a rescue/shelter
// @access  Private (Rescue/Shelter only)
router.patch("/rescue-shelter/:id", auth, upload.single('image'), async (req, res) => {
    console.log('PATCH /rescue-shelter/:id route hit'); // Log route hit
    console.log('req.file:', req.file); // Log req.file

    // Check if the authenticated user is a rescue-shelter
    if (req.userType !== 'rescue-shelter') {
        return res.status(403).json({ message: 'Unauthorized: Only rescue-shelters can edit pets.' });
    }

    try {
        const petId = req.params.id;
        const updates = req.body;

        // Parse healthVaccinations if it's a string (sent as JSON string from client)
        if (updates.healthVaccinations && typeof updates.healthVaccinations === 'string') {
            try {
                updates.healthVaccinations = JSON.parse(updates.healthVaccinations);
            } catch (error) {
                console.error('Failed to parse healthVaccinations JSON string:', error);
                return res.status(400).json({ message: 'Invalid healthVaccinations format' });
            }
        }

        // Find the pet by ID and petOwner ID to ensure ownership
        const pet = await Pets.findOneAndUpdate(
            { _id: petId, petOwner: req.userId },
            updates,
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ message: "Pet not found or you do not have permission to edit this pet." });
        }

        // Handle image upload if a new image is provided
        if (req.file) {
            console.log('New image uploaded. Updating pet.Photo'); // Log image update
            pet.Photo = '/uploads/' + req.file.filename;
            console.log('pet.Photo after update:', pet.Photo); // Log updated pet.Photo
            const savedPet = await pet.save(); // Save the pet document with the new photo path
            console.log('Result of pet.save() after image update:', savedPet); // Log save result
        }


        res.json(pet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/pets/rescue-shelter/:id
// @desc    Delete a pet by a rescue/shelter
// @access  Private (Rescue/Shelter only)
router.delete("/rescue-shelter/:id", auth, async (req, res) => {
    // Check if the authenticated user is a rescue-shelter
    if (req.userType !== 'rescue-shelter') {
        return res.status(403).json({ message: 'Unauthorized: Only rescue-shelters can delete pets.' });
    }

    try {
        const petId = req.params.id;

        // Find and delete the pet by ID and petOwner ID to ensure ownership
        const pet = await Pets.findOneAndDelete({ _id: petId, petOwner: req.userId });

        if (!pet) {
            return res.status(404).json({ message: "Pet not found or you do not have permission to delete this pet." });
        }

        res.json({ message: "Pet deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
