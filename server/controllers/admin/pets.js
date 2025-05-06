import Pets from "../../models/pets.js";
import { body, validationResult } from 'express-validator';

const getAllPets = async (req, res) => {
  try {
    const pets = await Pets.find().populate('petOwner', 'name');
    res.status(200).json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pets' });
  }
};

const addPetValidationRules = () => {
  return [
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
  ];
};

const addPet = async (req, res) => {
  await Promise.all(addPetValidationRules().map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, species, shortDescription, age, gender, breed, size, description, healthVaccinations, image, origin } = req.body;
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
      Photo: image,
      origin,
    });

    await newPet.save();
    res.status(201).json({ message: 'Pet created successfully', pet: newPet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create pet' });
  }
};

const updatePetValidationRules = () => {
  return [
    body("name").optional().notEmpty().withMessage("Name is required"),
    body("species").optional().notEmpty().withMessage("Species is required"),
    body("shortDescription").optional().notEmpty().withMessage("Short description is required"),
    body("age").optional().isInt({ gt: 0 }).withMessage("Age must be a positive integer"),
    body("gender").optional().isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("breed").optional().notEmpty().withMessage("Breed is required"),
    body("size").optional().isIn(["small", "medium", "large"]).withMessage("Invalid size"),
    body("description").optional().notEmpty().withMessage("Description is required"),
    body("healthVaccinations").optional().isArray().withMessage("Health and vaccinations must be an array"),
    body("origin").optional().isIn(["owner", "foster"]).withMessage("Invalid origin"),
  ];
};

const updatePet = async (req, res) => {
  await Promise.all(updatePetValidationRules().map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, species, shortDescription, age, gender, breed, size, description, healthVaccinations, image, origin } = req.body;

    const pet = await Pets.findByIdAndUpdate(
      id,
      { name, Species: species, shortDescription, Age: age, Gender: gender, Breed: breed, Size: size, description, healthVaccinations, Photo: image, origin },
      { new: true }
    );

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({ message: 'Pet updated successfully', pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update pet' });
  }
};

const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pets.findByIdAndDelete(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete pet' });
  }
};

export { getAllPets, addPet, updatePet, deletePet };