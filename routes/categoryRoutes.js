import express  from "express";
import { isAdmin, tokenVerify } from "../middlewares/authMiddleware.js";
import {createCategory, getAllCategory, getCategory, updateCategory, deleteCategory} from "../controller/categoryController.js"

//Router Object
const router = express.Router();

// ROUTING...


//POST METHOD, CREATE CATEGORY
router.post("/create-category", tokenVerify, isAdmin, createCategory);

// GET METHOD, GET ALL CATEGORY
router.get("/get-all", getAllCategory);

// GET METHOD, SINGLE CATEGORY
router.get("/get-category/:slug", getCategory);


// PUT METHOD, UPDATE CATEGORY 
router.put("/update/:id",tokenVerify, isAdmin ,updateCategory);


// POST DELETE, DELETE CATEGORY
router.delete("/delete/:id", tokenVerify, isAdmin ,deleteCategory);

export default router