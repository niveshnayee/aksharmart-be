import slugify from "slugify";
import productModel from "../models/productModel.js";


const createProduct = async(req,res) =>
{
    try {
        const {}
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong from server"
        });
    }
};

export {createProduct};