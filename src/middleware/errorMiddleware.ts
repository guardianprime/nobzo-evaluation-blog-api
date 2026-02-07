import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/appError.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose Cast Error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongo duplicate key error
  if ((err as any).code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
