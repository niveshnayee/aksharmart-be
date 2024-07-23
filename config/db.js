import mongoose from "mongoose";
import colors from "colors";
import userModel from "../models/userModel.js";



// connect with mongodb 
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.mongodb_url)
        console.log(`Connect to MongoDB Database ${conn.connection.host}`.bgYellow.black)
        
    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
};


async function addRoleField() {
    try {
      // Add a new field 'role' to all existing documents with default value false
      const updateResult = await userModel.updateMany(
        {}, // Filter - empty filter means all documents
        { $set: { role: false } } // Update - add new field 'role' with default value false
      );
  
      console.log('Updated documents =>', updateResult.nModified);
    } catch (err) {
      console.error('Error updating documents:', err);
    } 
  }

//   addRoleField().catch(console.dir);

export default connectDB;