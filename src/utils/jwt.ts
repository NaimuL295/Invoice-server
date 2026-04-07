import "dotenv/config";
import jwt from "jsonwebtoken";


const SECRET_KEY = process.env.SECRET_KEY 

export const generateToken = (user: any) => {
    return jwt.sign(
        { id: user.id, email: user.email }, 
        SECRET_KEY as string,                       
        { expiresIn: "7d" }              
    );
};