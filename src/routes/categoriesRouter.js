import express from 'express';
import { createCategories, getCategories } from '../controllers/categoryControllers.js';
import validateCategory from '../middlewares/validateCategory.js';

const router = express.Router();

router.get("/", getCategories);
router.post("/", validateCategory, createCategories);

export default router;