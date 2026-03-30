import "dotenv/config"
import { prisma } from "./lib/prisma";
import cors from "cors";
import { CreateInvoiceRequest,  } from "./type";
import { Request, Response } from "express";
import express from "express";
import { getMe, getProfile, googleCallback, localLogin, logout, register } from "./Controller/Auth/authController";
import passport from "./config/passport";
import session from "express-session";
import { protect } from "./utils/Middleware/Middleware";
import { singleInvoice, userInvoice } from "./Controller/Invoice/invoiceController";
import {  printSelect } from "./Controller/PrintSettings/PrintSettingsController";

type TypedRequest<T> = Request<{}, {}, T>;

const app = express();
const port=process.env.PORT || 5000;
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials:true,
}));

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


app.use(passport.initialize());
app.use(passport.session());
app.get("/",(req:Request,res:Response)=>{
res.send("server run")
});
app.post(
  "/invoice",
  async (req: TypedRequest<CreateInvoiceRequest>, res: Response) => {
    try {
      const {
        uid,
        userId,
        date,
        customer,
        items,
        subtotal,
        total,
        discount,
        received,
        due,
        paymentType,
        description,
      } = req.body;
      console.log(req.body);
      const invoiceCreate = await prisma.invoice.create({
        data: {
          uid,
          date: new Date(date!),
          customer,

          subtotal,
          discount: Number(discount),
          received: Number(received),

          total: Number(total), // OR calculatedTotal

          due: Number(due),

          description,
          paymentType,

          user: {
            connect: { id: Number(userId) },
          },
          items: {
            create: items.map((item: any) => ({
              item_name: item.item_name,
              quantity: item.quantity,
              unit: item.unit,
              price: item.price,
            })),
          },
        },
      });
      res.json(invoiceCreate);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating invoice" });
    }
  },
);





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
app.get("/me", getMe);
app.get("/profile", protect, getProfile);



//userInvoice
// app.get("/api/invoice/:userId", userInvoice);
app.get("/api/invoice", userInvoice);
app.get("/api/invoice/:id",singleInvoice);


// print settings
// app.post("/api/print-settings", printOption);
// app.get("/api/print-settings", PrintFind);
app.patch("/api/print-settings", printSelect);





app.listen(port, () => console.log(`Server running on ${port}`));
