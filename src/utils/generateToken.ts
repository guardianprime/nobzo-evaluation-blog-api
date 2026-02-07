import jwt from "jsonwebtoken";

export const generateToken = (payload: object) => {
  const secret = process.env.JWT_SECRET as jwt.Secret;
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};
