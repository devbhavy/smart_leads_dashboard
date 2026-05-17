import express from "express";
import { userRouter } from "./user.js";
import { leadRouter } from "./lead.js";
const rootRouter = express.Router();

rootRouter.use("/user",userRouter);
rootRouter.use("/lead",leadRouter)



export {rootRouter}