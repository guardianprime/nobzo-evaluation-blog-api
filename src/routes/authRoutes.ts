import { Router ,type Request , type Response} from "express";
import { User } from "../models/UserModel.js";

const authRouter:Router = Router();

authRouter.post("/register", async(req: Request, res:Response) => {
    const userData = req.body;
try {
    await User.find({email: userData.email})
} catch (error) {
    console.log(error)
}
})

authRouter.post("/login", async(req: Request, res:Response) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
       
        res.json({message: "Login successful"})
    } catch (error) {
        console.log(error)
    }
}

export default authRouter;