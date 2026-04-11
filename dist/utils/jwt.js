import "dotenv/config";
import jwt from "jsonwebtoken";
export const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "7d" });
};
