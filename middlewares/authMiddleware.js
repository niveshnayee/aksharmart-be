import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";


const tokenVerify = async (req, res, next) => {
    try 
    {
        const decode = jwt.verify(
            req.headers.authorization,
            process.env.secret_jwt
          );

        req.user = decode;
        next();
    } catch (error) {
        console.log(error)
    }
};


const isAdmin = async (req,res,next) => {
    try {
        
        const user = await userModel.findById(req.user._id);

        if(!user.role){
            console.log("access aprrove!!");
            res.status(401).send({
                success : false,
                message : "UnAuthorized Access"
            });
        }
        else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401);
    }
};

export {isAdmin, tokenVerify};