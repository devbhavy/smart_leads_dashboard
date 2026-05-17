import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import type { NextFunction } from "express";
import { signInInputSchema, signUpInputSchema } from "../lib/zod.js";
import { User } from "../lib/mongoose.js";
dotenv.config();


export async function authMiddleware(req: any, res: any, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD!) as { _id: string };
        const user = await User.findById(decoded._id);
        if (!user) return res.status(401).json({ msg: "User not found" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid token" });
    }
}


export async function signUpMiddleware(req:any,res:any,next:any){
    const input = req.body;
    const check = signUpInputSchema.safeParse(input);

    if(check.success){
        const hashedPassword = await bcrypt.hash(input.password,10);
        req.hashedPassword = hashedPassword
        next();

    }else{
        return res.status(400).json({
            msg : "invalid input"
        })
    }

}

export function signInMiddleware(req:any,res:any,next:any){
    const input = req.body;
    const check = signInInputSchema.safeParse(input);

    if(check.success){
        next();
    }else{
        return res.status(400).json({
            msg : "Invalid input"
        })
    }
}