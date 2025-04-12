// server/controllers/admin/index.js
const express = require('express');
const router = express.Router();
const { getAllPetOwners } = require('./pet-owners');

router.get('/pet-owners', getAllPetOwners);

module.exports = router;