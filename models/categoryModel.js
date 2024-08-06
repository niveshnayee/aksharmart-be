import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        unique: true
    },
    slug: {
        type: String,
        lowercase : true,
        unique: true,
        required : true,
    }
        
});

// Create an index on the slug field for faster queries
categorySchema.index({ slug: 1 });

export default mongoose.model('Category', categorySchema);
