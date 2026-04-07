import "dotenv/config";
import Jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    const token = req.cookies.token; // read JWT from cookie
    if (!token)
        return res.status(401).json({ message: "Not authorized" });
    try {
        const decoded = Jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
