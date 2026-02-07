import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/UserModel.js";
import { generateToken } from "../utils/generateToken.js";

const authRouter: Router = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken({ id: user._id.toString() });

    return res.status(201).json({
      message: "User created",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
