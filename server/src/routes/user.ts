import express from "express";
import { User } from "../lib/mongoose.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { signInMiddleware, signUpMiddleware } from "../middlewares/middleware.js";
const userRouter = express.Router();

userRouter.post("/signup",signUpMiddleware,async function(req:any,res){
    const {username,email,role} = req.body;
    const hashedPassword = req.hashedPassword;

    try{
        const response = await User.create({
            userName : username,
            email : email,
            password : hashedPassword,
            role : role

        });

        const token = jwt.sign({_id : response._id},process.env.JWT_PASSWORD||"")

        res.json({
            token
        })
        
    }catch(err){
        console.log(err)
        return res.status(400).json({
            msg : "some error occurred"
        })
    }
})



userRouter.post("/signin",signInMiddleware,async function(req,res){
    const {email,password} = req.body;
    if(email==null||password==null){
        return res.status(400).json({
            msg : "invalid input"
        })
    }

    try{
        const response = await User.findOne({
            email : email
        });
        if(response==null){
            return res.status(400).json({
                msg : "email not found"
            })
        }
        const checkPassword = await bcrypt.compare(password,response.password);
        
        if(checkPassword){
            const output = jwt.sign({_id : response._id},process.env.JWT_PASSWORD||"");
            return res.json({token : output});
        }else{
            return res.status(400).json({
                msg : "invalid password"
            })
        }



    }catch(err){
        return res.json({
            msg : "some error occurred processing your request!!"
        })

    }

})



export {userRouter}