import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

mongoose.connect(process.env.MONGO_URL!);


const userSchema = new mongoose.Schema({
    userName : {type : String , required : true},
    email : {
        type : String,
        unique : true,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    password : {type : String,required : true},
    createdAt : {
        type : Date,
        default : Date.now
    }

});


const leadSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    source : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"

    }

})


const User = mongoose.model("User",userSchema);

const Lead = mongoose.model("Lead",leadSchema);

export {User,Lead}