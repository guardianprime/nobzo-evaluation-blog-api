import { Router,type Response, type Request } from "express";

type Post = {
    title: string;
    content: string;   
 }

const postRouter: Router = Router();

postRouter.get("/", (req: Request, res:Response) => {
    res.send("posts routes");
})
postRouter.get("/:slug", (req: Request, res:Response) => {
    res.send("posts routes");
})

postRouter.post("/", (req: Request, res:Response) => {
    res.send("posts routes");
})

postRouter.put("/:id", (req: Request, res:Response) => {
    res.send("posts routes");
})

postRouter.delete("/:id", (req: Request, res:Response) => {
    res.send("posts routes");
})

export default postRouter;
