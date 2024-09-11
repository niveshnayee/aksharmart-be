import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'



// CREATING PRODUCT 

const createProduct = async(req,res) =>
{
    try {
        const {name, description, price, category, quantity, shipping} = req.fields;
        
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
            case !quantity:
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
        // Extract page and itemPerPage from query parameters
        let { page, itemPerPage, search } = req.query;
        if(!page && !itemPerPage)
        {
            const products = await productModel.find({}).select("-photo").populate("category").limit(20).sort({createdAt : -1});

            return res.status(200).send({
                success: true,
                message: "All products",
                products,
                length : products.length
            });
        }

        let args = {};
        if(search)
        {
            args.$or = [
                {name: {$regex: search, $options: 'i'}},
                {description: {$regex: search, $options: 'i'}},
                // {category: {$regex: search, $options: 'i'}}
            ]
        }
        // Parse page and itemPerPage as integers
        page = parseInt(page, 10);
        itemPerPage = parseInt(itemPerPage, 10);

        // Get the total count of products
        const totalProducts = await productModel.countDocuments(args);

        const products = await productModel
            .find(args)
            .select("-photo")
            .skip((page-1) * itemPerPage)
            .limit(itemPerPage)
            .sort({createdAt: -1});

        return res.status(200).send({
            success: true,
            message: "All products",
            products,
            length : products.length,
            totalProducts
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


// GET Product by Category ID
const getProductByCategory = async(req,res) =>
{
    try {
        // const products = await productModel.find({category : req.params.id}).select("-photo").populate("category").limit(12);

        const products = await productModel.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'Categories'
                }
            },
            {
                $unwind: '$Categories'
            },
            {
                $match: { 'Categories.slug': req.params.slug}
            },
            {
                $project: {photo : 0}
            },
            {
                $limit : 12
            }
        ]);

        return res.status(200).send({
            success: true,
            message: "products by category",
            products
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
        const {name, description, price, category, quantity} = req.fields;
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
            case !quantity:
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

// Filter product details requirements 
const productFilterController = async(req, res) =>
{
    try {
        const {checked, radio, page, itemPerPage} = req.body;

        let args = {};
       

        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0] , $lte: radio[1]};

        // // Parse page and itemPerPage as integers
        // page = parseInt(page, 10);
        // itemPerPage = parseInt(itemPerPage, 10);

        // Get the total count of products
        const totalProducts = await productModel.countDocuments(args);

        const products = await productModel
            .find(args)
            .select("-photo")
            .skip((page-1) * itemPerPage)
            .limit(itemPerPage)
            .sort({createdAt: -1});


        return res.status(200).send({
            success: true,
            message: "All products",
            products,
            length : products.length,
            totalProducts
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong from server",
            error
        }); 
    }
};

// related products to show
const relatedProduct = async (req, res) =>
{
    try {
        const {pid, cid} = req.params;

        const related_products = await productModel.find({
            category: cid,
            _id : {$ne: pid}
        }).select("-photo").limit(4);

        return res.status(200).send({
                success: true,
                message: "related products",
                related_products
            });

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong from server",
            error
        });
    }
};



export {createProduct, getAllProduct, getProduct, getPhoto, updateProduct, deleteProduct, getProductByCategory, productFilterController, relatedProduct};