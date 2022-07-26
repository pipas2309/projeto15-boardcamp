import express from 'express';
import { createRentals, deleteRentals, finishRentals, getRentals } from '../controllers/rentalControllers.js';
import validateRental from '../middlewares/validateRental.js';


const router = express.Router();

router.get("/", getRentals);
router.post("/", validateRental, createRentals);
router.post("/:id/return", finishRentals);
router.delete("/:id", deleteRentals);

export default router;