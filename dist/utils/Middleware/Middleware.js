import "dotenv/config";
// export const protect = (req: any, res: Response, next: NextFunction) => {
//   const token = req.cookies.token;
// console.log(token)
//   if (!token) {
//      console.log("No token found in cookies!");
//     return res.status(401).json({ message: "Not authorized" });
//   }
//   try {
//     const decoded = Jwt.verify(token, process.env.SECRET_KEY as string);
//     req.user = decoded;
//     next();
//   } catch (error: any) {
//     // console.log("Verify error:", error.message);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
export const protect = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
};
