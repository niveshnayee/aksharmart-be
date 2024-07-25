import { express } from "express";
import { isAdmin, tokenVerify } from "../middlewares/authMiddleware.js";
import { createProduct } from "../controller/productController.js";

// Routing object
const router = express.Router();


// POST METHOD, CREATE PRODUCT
router.post("/create", tokenVerify, isAdmin, createProduct);






export default router;