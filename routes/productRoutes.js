import express from "express";
import { isAdmin, tokenVerify } from "../middlewares/authMiddleware.js";
import { createProduct, getAllProduct, getProduct, getPhoto, updateProduct, deleteProduct} from "../controller/productController.js";
import formidable from "express-formidable";

// Routing object
const router = express.Router();


// POST METHOD, CREATE PRODUCT
router.post("/create", tokenVerify, isAdmin, formidable(), createProduct);

// GET METHOD, GETTING ALL PRODUCT
router.get("/get-all", getAllProduct);

// GET METHOD, GET SPECIFIC PRODUCT by SLUG
router.get("/get-product/:slug", getProduct);

// GET METHOD, GET PRODUCT PHOTO BY ID
router.get("/get-photo/:id", getPhoto);

// PUT METHOD, UPDATE PRODUCT BY ID
router.put("/update-product/:id", tokenVerify, isAdmin, formidable(), updateProduct);

// DELETE METHOD, DELETE PRODUCT by ID
router.delete("/delete-product/:id", tokenVerify, isAdmin, formidable(),deleteProduct);


export default router;