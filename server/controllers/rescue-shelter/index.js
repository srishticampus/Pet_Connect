import express from 'express';
import lostFoundPetsRouter from './lost-found-pets.js'; // Import the lost-found-pets router
import adoptedPetsRouter from './adopted-pets.js'; // Import the adopted-pets router
import fosteredPetsRouter from './fostered-pets.js'; // Import the fostered-pets router

const router = express.Router();

// Mount the lost-found-pets router
router.use('/lost-found-reports', lostFoundPetsRouter);

// Mount the adopted-pets router
router.use('/adopted-pets', adoptedPetsRouter);

// Mount the fostered-pets router
router.use('/fostered-pets', fosteredPetsRouter);

export default router;
