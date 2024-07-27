import slugify from "slugify";
import CategoryModel from "../models/categoryModel.js";


// POST CREATE 
const createCategory = async(req,res) => 
{
    try {
        const {name} = req.body;
        console.log("reading name at controller : ",name);

        if(!name){
            return res.status(401).send({
                success: false,
                message: "Category name required"
            });
        }

        const  existingCategory = await CategoryModel.findOne({name});
        if(existingCategory)
        {
            return res.status(401).send({
                success: false,
                message : "Category Already Exists"
            });
        }

        // New document creating and saving
        const category = await new CategoryModel({name, slug: slugify(name)}).save();

        return res.status(200).send({
            success: true,
            message: "create Category success",
            category
        });
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message : "Something in server went wrong",
            error
        })
    }
};

// Getting all Categories
const getAllCategory = async(req,res) => {
    try {
        const categories = await CategoryModel.find({});

        return res.status(200).send({
            success: true,
            message: "All Categories",
            categories
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something wrong from server",
            error
        })
    }
};

// Getting SPECIFIC Category 
const getCategory = async (req,res) => {
    try {
        const category = await CategoryModel.findOne({slug:req.params.slug});
        if(!category){
            return res.status(401).send({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Read Category",
            category
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something wrong from server",
            error
        });
    }
};

// UPDATING THE EXISTING CATEGORY
const updateCategory = async (req,res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;

        if(!name.trim()){
            return res.status(404).send({
                success: false,
                message: "Please provide name to update category"
            });
        }
        if(!id)
        {
            return res.status(404).send({
                success: false,
                message: "Please provide ID to update category"
            });
        }

        const updated = await CategoryModel.findByIdAndUpdate(
            id, {name, slug: slugify(name)}, {new: true});

        return res.status(200).send({
            success: true,
            message: "Successfully updated",
            updated
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something wrong from server",
            error
        });
    }
};


// DELETING CATEGORY 
const deleteCategory = async (req,res) => {
    try {
        const {id} = req.params;

        if(!id)
        {
            return res.status(404).send({
                success: false,
                message: "Please provide ID to delete category"
            });
        }

        await CategoryModel.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message: "Deleted Successfully!"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something wrong from server",
            error
        });
    }
};




export {createCategory , getAllCategory, getCategory, updateCategory, deleteCategory};