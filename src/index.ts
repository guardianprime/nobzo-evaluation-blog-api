import express, { Request, Response } from "express";

const app = express()

const port = 8000;

app.get("/" , (req:Request, res:Response) =>{
    res.send("server is working fine")
})

app.listen(port, ()=>{
    console.log(`server is running on localhost:${port}`)
})