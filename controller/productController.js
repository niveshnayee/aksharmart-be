import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'



// CREATING PRODUCT 

const createProduct = async(req,res) =>
{
    try {
        const {name, description, price, category, qauntity} = req.fields;
        const {photo} = req.files;

        switch(true){
            case !name:
                return res.status(401).send({success: false, message: "Name is required"});
            case !description:
                return res.status(401).send({success: false, message: "Description is required"});
            case !price:
                return res.status(401).send({success: false, message: "Price is required"});
            case !category:
                return res.status(401).send({success: false, message: "Category id is required"});
            case !qauntity:
                return res.status(401).send({success: false, message: "Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(401).send({success: false, message: "Photo should be less than 1MB"});
        }
        const product = new productModel({...req.fields, slug:slugify(name)});

        if(photo)
        {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        return res.status(201).send({
            success: true,
            message: "Product created Successfully!",
            product
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong from server"
        });
    }
};



// TO GET ALL PRODUCTS 
const getAllProduct = async(req,res) =>
{
    try {
        const products = await productModel.find({}).select("-photo").populate("category").limit(20).sort({createdAt : -1});

        return res.status(200).send({
            success: true,
            message: "All products",
            products,
            length : products.length
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong in server side",
            error
        });
    }
};



// TO GET SPECIFIC PRODUCT 
const getProduct = async(req,res) =>
{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");

        if(!product){
            return res.status(401).send({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Product extracted",
            product
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "something went wrong form server",
            error
        });
    }
};


// TO GET PHOTO FOR SPECIFIC PRODUCT 
const getPhoto = async(req,res) => {
    try {
        const product = await productModel.findById(req.params.id).select("photo");
        if(!product.photo.data)
        {
            return res.status(401).send({
                success: false,
                message: "No Photo data Available"
            });
        }

        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong from server",
            error
        });
    }
};


// UPDATING PRODUCT INFO HERE

const updateProduct = async(req,res) =>
{
    try {
        const {name, description, price, category, qauntity} = req.fields;
        const {photo} = req.files;

        switch(true){
            case !name:
                return res.status(401).send({success: false, message: "Name is required"});
            case !description:
                return res.status(401).send({success: false, message: "Description is required"});
            case !price:
                return res.status(401).send({success: false, message: "Price is required"});
            case !category:
                return res.status(401).send({success: false, message: "Category id is required"});
            case !qauntity:
                return res.status(401).send({success: false, message: "Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(401).send({success: false, message: "Photo should be less than 1MB"});
        }

        const updatedProduct = await productModel.findByIdAndUpdate( req.params.id,{...req.fields, slug:slugify(name)}, {new:true});

        if(photo)
        {
            updatedProduct.photo.data = fs.readFileSync(photo.path);
            updatedProduct.photo.contentType = photo.type;
        }

        await updatedProduct.save();

        return res.status(200).send({
            success: true,
            message: "update success",
            updatedProduct
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong from server",
            error
        }); 
    }
};


// DELETING PRODUCT BY ID FROM REQ.PARAMS
const deleteProduct = async(req,res) =>
{
    try {

        if(!req.params.id)
        {
            return res.status(404).send({
                success: false,
                message: "Please provide ID to delete category"
            });
        }

        await productModel.findByIdAndDelete(req.params.id);

        res.status(200).send({
            success: true,
            message: "deletion success"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong from server",
            error
        }); 
    }
};



export {createProduct, getAllProduct, getProduct, getPhoto, updateProduct, deleteProduct};