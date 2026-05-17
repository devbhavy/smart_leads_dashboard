import express from "express"
import dotenv from "dotenv"
import { rootRouter } from "./routes/index.js";
import cors from "cors"
const app = express();
dotenv.config();


const PORT = process.env.PORT||3000;

app.use(cors());
app.use(express.json());

app.get("/health",function(req,res){
    res.status(200).json({
        msg : "healthy"
    })
})

app.use("/api",rootRouter)



app.listen(PORT,function(){
    console.log(`server started on port :${PORT}`)
})