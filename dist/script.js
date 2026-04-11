import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import { protect } from "./utils/Middleware/Middleware.js";
import { getMe, getProfile, googleCallback, localLogin, logout, register, } from "./Controller/Auth/authController.js";
import { createInvoice, deleteData, modifyInvoice, singleInvoice, userInvoice, } from "./Controller/Invoice/invoiceController.js";
import { getPrintSettings, updatePrintSettings, } from "./Controller/PrintSettings/PrintSettingsController.js";
const app = express();
const port = Number(process.env.PORT) || 5000;
app.set("trust proxy", 1);
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());
/* ================= REDIS + SESSION ================= */
const redisClient = createClient({
    url: process.env.REDIS_URL, // ✅ .env
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
async function startServer() {
    await redisClient.connect();
    // console.log("✅ Redis connected");
    app.use(session({
        store: new RedisStore({ client: redisClient, prefix: "sess:" }),
        secret: process.env.SECRET_KEY || "secret",
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    /* ================= ROUTES ================= */
    app.post("/auth/register", register);
    app.post("/auth/login", passport.authenticate("local", { session: true }), localLogin);
    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"],
    }));
    app.get("/auth/google/callback", passport.authenticate("google", {
        failureRedirect: "/",
    }), googleCallback);
    app.get("/me", protect, getMe);
    app.post("/auth/logout", logout);
    app.get("/profile", getProfile);
    // invoices
    app.post("/api/create", createInvoice);
    app.get("/api/invoice", protect, userInvoice);
    app.get("/api/invoice/:id", singleInvoice);
    app.patch("/api/modify/:id", modifyInvoice);
    app.delete("/api/delete/:id", deleteData);
    // print settings
    app.get("/api/print-settings", getPrintSettings);
    app.patch("/api/print-settings", updatePrintSettings);
    app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Server running on ${port}`);
    });
}
startServer();
