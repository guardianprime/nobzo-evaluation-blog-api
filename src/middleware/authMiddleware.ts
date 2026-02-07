import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret || !token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, secret) as unknown as {
      id: string;
    };

    req.user = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
