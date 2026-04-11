import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_KEY as string, 
    { expiresIn: "7d" }
  );
};