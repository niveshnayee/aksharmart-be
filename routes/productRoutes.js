import express from "express";
import { isAdmin, tokenVerify } from "../middlewares/authMiddleware.js";
import { createProduct, getAllProduct, getProduct, getPhoto, updateProduct, deleteProduct, getProductByCategory, productFilterController, relatedProduct} from "../controller/productController.js";
import formidable from "express-formidable";

// Routing object
const router = express.Router();


// POST METHOD, CREATE PRODUCT
router.post("/create", tokenVerify, isAdmin, formidable(), createProduct);

// GET METHOD, GETTING ALL PRODUCT
router.get("/get-all", getAllProduct);

// GET METHOD, GETTING PRODUCT BY CATEGORY ID
router.get("/get/by/:slug", getProductByCategory);

// GET METHOD, GET SPECIFIC PRODUCT by SLUG
router.get("/get-product/:slug", getProduct);

// GET METHOD, GET PRODUCT PHOTO BY ID
router.get("/get-photo/:id", getPhoto);

// PUT METHOD, UPDATE PRODUCT BY ID
router.put("/update-product/:id", tokenVerify, isAdmin, formidable(), updateProduct);

// DELETE METHOD, DELETE PRODUCT by ID
router.delete("/delete-product/:id", tokenVerify, isAdmin, formidable(),deleteProduct);

//GET METHOD, FILTER PRODUCTS
router.post("/filter-products", productFilterController);

// GET METHOD, RELATED PRODUCTS
router.get("/related-products/:pid/:cid", relatedProduct)


export default router;