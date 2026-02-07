import express from "express";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = process.env.Port;

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(port, async () => {
  await connectDB();
  console.log(`server is running on localhost:${port}`);
});
