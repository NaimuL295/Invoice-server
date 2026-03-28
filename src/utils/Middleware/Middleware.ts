import"dotenv/config"
import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const protect = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // read JWT from cookie
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = Jwt.verify(token, process.env.SECRET_KEY as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};