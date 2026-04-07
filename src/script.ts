import "dotenv/config"
import cors from "cors";
import { Request, Response } from "express";
import express from "express";
import { getMe, getProfile, googleCallback, localLogin, logout, register } from "./Controller/Auth/authController";
import passport from "./config/passport";
import session from "express-session";
import { protect } from "./utils/Middleware/Middleware";
import { createInvoice, deleteData, modifyInvoice, singleInvoice, userInvoice } from "./Controller/Invoice/invoiceController";
import { getPrintSettings, updatePrintSettings } from "./Controller/PrintSettings/PrintSettingsController";
import cookieParser from "cookie-parser";

// import { createClient } from "redis";
// import { RedisStore } from "connect-redis"; 

const app = express();
const port=process.env.PORT || 5000;
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials:true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
  secure: false,
  sameSite: "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);
// const redisClient = createClient({
//   url: "",

// });

// redisClient.on("error", (err) => console.log("Redis Client Error", err));

// await redisClient.connect();
// console.log("✅ Redis connected");


// app.use(
//   session({
//     store: new RedisStore({
//       client: redisClient,
//       prefix: "sess:",
//     }),
//     secret: "secret123",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // Set to true if using HTTPS
//         httpOnly: true,
//         maxAge: 1000 * 60 * 10 // 10 minutes
//     }
//   })
// );




app.use(passport.initialize());
app.use(passport.session());
app.get("/",(req:Request,res:Response)=>{
res.send("server run")
});

app.post("/api/create", createInvoice);



// auth
// Register
app.post("/auth/register", register);

// Login
app.post(
  "/auth/login",
  passport.authenticate("local", { session: true }),
  localLogin
);
app.get("/auth/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { session: true, failureRedirect: "/" }), googleCallback);
app.post("/auth/logout", logout);

// protected
app.get("/me",   getMe);
app.get("/profile", getProfile);


//userInvoice
// app.get("/api/invoice/:userId", userInvoice);

app.get("/api/invoice",protect, userInvoice);
app.get("/api/invoice/:id",singleInvoice);
app.patch("/api/modify/:id", modifyInvoice )
app.delete("/api/delete/:id",  deleteData)
// print settings
app.get("/api/print-settings", getPrintSettings);
app.patch("/api/print-settings", updatePrintSettings);


app.listen(port, () => console.log(`Server running on ${port}`));
