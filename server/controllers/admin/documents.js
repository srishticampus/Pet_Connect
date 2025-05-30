import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Document from '../../models/document.js';
import auth from '../../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/admin/documents
// @desc    Upload/add new documents
// @access  Private (Admin only)
router.post('/', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const { title, description, associatedApplicationType } = req.body;

    const newDocument = new Document({
      title,
      description,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      associatedApplicationType,
      uploadedBy: req.user.id, // Assuming req.user.id is set by auth middleware
    });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/documents
// @desc    Retrieve all documents
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.find().populate('uploadedBy', 'name email');
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/documents/:id
// @desc    Retrieve a specific document
// @access  Private (Admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('uploadedBy', 'name email');

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/documents/:id
// @desc    Update document metadata
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  const { title, description, associatedApplicationType } = req.body;

  // Build document object
  const documentFields = {};
  if (title) documentFields.title = title;
  if (description) documentFields.description = description;
  if (associatedApplicationType) documentFields.associatedApplicationType = associatedApplicationType;

  try {
    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Ensure user is admin (auth middleware should handle this, but good to double check if roles are implemented)
    // if (req.user.role !== 'admin') {
    //   return res.status(401).json({ msg: 'User not authorized' });
    // }

    document = await Document.findByIdAndUpdate(
      req.params.id,
      { $set: documentFields },
      { new: true }
    );

    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/documents/:id
// @desc    Delete documents and their associated files
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Remove the file from the file system
    fs.unlink(document.filePath, async (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`);
        // Even if file deletion fails, proceed to delete the database entry
      }
      await Document.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Document removed' });
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;
