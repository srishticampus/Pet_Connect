import { validationResult, body } from 'express-validator';
import Contact from '../models/contact.js';
import express from 'express';
export const router = express.Router();

const validateContact = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Email is invalid'),
  body('comments').trim().isLength({ min: 1 }).withMessage('Comments are required'),
];

const createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, comments } = req.body;
    const contact = new Contact({ name, email, comments });
    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

router.post('/', validateContact, createContact);
router.get('/', getContacts);
router.delete('/:id', deleteContact);