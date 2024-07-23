import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import jwt from "jsonwebtoken"

// POST REGISTER 
const  registerController = async(req, res) => {
    try {
        const {firstName, lastName, email, password, secretKey} = req.body;

        //  Validations
        if(!firstName || !lastName){
            return res.send({message: "First and Last Name is Required!"});
        }
        if(!email){
            return res.send({message: "Email is Required!"});
        }
        if(!password){
            return res.send({message: "Password is Required!"});
        }
        if(!secretKey){
            return res.send({message: "secretKey is Required!"});
        }

        //existing user
        const existingUser = await userModel.findOne({email});
        if(existingUser)
        {
            return res.status(200).send({
                success: false,
                message: "User alreasy exists, Please Login"
            })
        }
         
        // registering user
        const hashedPassword = await hashPassword(password);

        const user = await new userModel({firstName,lastName, email, password : hashedPassword, secretKey }).save();

         // authorization
        const token = await jwt.sign({_id: user._id}, process.env.secret_jwt, {expiresIn : "2hr"})

        res.status(201).send({
            success: true,
            message : "Successfully Registered!",
            user:{
                first_name: user.firstName,
                last_name : user.lastName, 
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token

        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : "Error in Registration",
            error
        })
    }
};


// POST LOGIN
const loginController = async(req, res) => {
    try {

        const {email, password} = req.body;

        if(!email.trim() || !password)
        {
            return res.status(404).send
            (
                {
                    success : false,
                    message : "invalid email or password"
                }
            )
        }

        const user = await userModel.findOne({email});

        if(!user)
        {
            return res.status(404).send({
                success : false,
                message : "email not found, Please register"
            });
        }

        const isMatch = await comparePassword(password, user.password);

        if(!isMatch)
        {
            return res.status(200).send({
                success: false,
                message : "invalid passowrd"
            })
        }

        // authorization
        const token = await jwt.sign({_id: user._id, name: user.name}, process.env.secret_jwt, {expiresIn : "7d"})

        res.status(200).send({
            success: true,
            message: "Login Successful",
            user:{
                first_name: user.firstName,
                last_name : user.lastName, 
                email: user.email,
                phone: user.phone,
                address: user.address,
                role : user.role
            },
            token
        });
        
    } catch (error) 
    {
        console.log(error);
        res.status(500).send({
            success : false,
            message : "Error in Login",
            error
        })
    }
};



// FORGOT PASSWORD CONTROLLER, POST
const forgotPasswordController = async (req, res) => {
    try {
        const {email, secretKey, password} = req.body;

        if(!email.trim() || !secretKey){
            return res.status(404).send
            (
                {
                    success : false,
                    message : "Email and Save Key is Required!"
                }
            )
        }
        if(!password)
        {
            return res.status(404).send
            (
                {
                    success : false,
                    message : "Please provide New Password"
                }
            )
        }

        const user = await userModel.findOne({email, secretKey});

        if(!user)
        {
            return res.status(404).send({
                success : false,
                message : "Wrong Email or Save key"
            });
        }

        const hashed = await hashPassword(password);

        await userModel.findByIdAndUpdate(user._id, {password : hashed})
        res.status(200).send({
            success : true,
            message : "Password Reset Successfully!"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : "Error in Forgot Password",
            error
        })
    }
}


// Admin Controller, GET
const adminController = async(req, res) =>
{
    try {
        res.status(200).send({ok: true, message : "Admin Accessed"})
    } catch (error) {
        console.log(error);
        res.send({error});
    }
};







export  {registerController, loginController, adminController, forgotPasswordController};