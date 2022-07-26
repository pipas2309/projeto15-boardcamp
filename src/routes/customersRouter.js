import express from 'express';
import { createCustomer, getCustomer, getCustomers, updateCustomer } from '../controllers/cutomerControllers.js';
import validateCustomer from '../middlewares/validateCustomer.js';


const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/", validateCustomer, createCustomer);
router.put("/:id", validateCustomer, updateCustomer);

export default router;