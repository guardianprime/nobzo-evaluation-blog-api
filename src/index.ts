import express, { type Request, type Response } from "express";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import { connectDB } from "./config/db.js";

const app = express()

const port = 8000;

app.get("/" , (req:Request, res:Response) =>{
    res.send("server is working fine")
})

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)


app.listen(port, ()=>{
    connectDB();
    console.log(`server is running on localhost:${port}`)
})