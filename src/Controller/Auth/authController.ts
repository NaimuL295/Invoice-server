 import "dotenv/config"
import { Request, Response } from "express";
import { generateToken } from "../../utils/jwt.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const { user_name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { user_name, email, password: hashedPassword },
    });

    //  SAME AS LOGIN
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "Register success",
      user: {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
// Local login
export const localLogin = async (req: any, res: Response) => {
  const token = generateToken(req.user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login success",
    user: { id: req.user.id, email: req.user.email },
  });
};

// Google callback
export const googleCallback = (req: any, res: Response) => {
  const token = generateToken(req.user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
 // console.log("AFTER LOGIN USER:", req.user); //  check
res.redirect(`${process.env.FRONTEND_START as string}`);
};

// Current user
export const getMe = (req: any, res: Response) => {
 //  console.log("REQ.USER:", req.user); //  add this
  res.json(req.user || null);
};

// Protected profile
export const getProfile = (req: any, res: Response) => {
  res.json({
    message: "Profile data",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
};

// Logout
export const logout = (req: any, res: Response) => {
  req.logout((err: any) => {
    if (err) return res.status(500).json({ message: "Logout error" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid"); //  important
       res.clearCookie("token"); //  important
      res.json({ message: "Logout success" });
    });
  });
};