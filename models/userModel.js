import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type : String,
            unique : true,
            required : true
        },
        password: {
            type : String,
            required : true
        },
        phone : {
            type :  String,
        },
        address : {
            type : String,
        },
        secretKey : {
            type : String,
            required : true
        },
        role : {
            type : Boolean,
            default : false
        }
    }, {timestamps: true}
);

export default mongoose.model('users', userSchema);

