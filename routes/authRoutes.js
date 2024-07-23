import express from "express";
import {registerController, loginController, adminController, forgotPasswordController} from "../controller/authController.js"
import { isAdmin, tokenVerify } from "../middlewares/authMiddleware.js";

// router object 
const router = express.Router();

// routing
// REGISTER, METHOD POST
router.post('/register', registerController);

// LOGIN, METHOD POST
router.post('/login', loginController);

// FORGOT PASSWORD, METHOD POST
router.post('/forgot-password', forgotPasswordController);

// ADMIN, METHOD GET
router.get('/admin', tokenVerify, isAdmin, adminController);

//Protected route auth
router.get('/user-auth', tokenVerify, (req,res) => {
    res.status(200).send({ok: true});
});


export default router