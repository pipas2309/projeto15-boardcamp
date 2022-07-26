import express from 'express';
import { createCustomer, getCustomer, getCustomers, updateCustomer } from '../controllers/cutomerControllers.js';
import validateGame from '../middlewares/validateGame.js';


const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/", validateGame, createCustomer);
router.put("/:id", validateGame, updateCustomer);

export default router;