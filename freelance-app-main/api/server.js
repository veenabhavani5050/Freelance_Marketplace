/* ─────────────────── server.js (backend root) ─────────────────── */
import express       from "express";
import mongoose      from "mongoose";
import dotenv        from "dotenv";
import cookieParser  from "cookie-parser";
import cors          from "cors";

// ─── Load .env FIRST ─────────────────────────────────────────────
dotenv.config();

// ─── Route Imports ───────────────────────────────────────────────
import userRoute        from "./routes/user.route.js";
import gigRoute         from "./routes/gig.route.js";
import orderRoute       from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute     from "./routes/message.route.js";
import reviewRoute      from "./routes/review.route.js";
import authRoute        from "./routes/auth.route.js";

// ─── App Init ────────────────────────────────────────────────────
const app = express();
mongoose.set("strictQuery", true);

// ─── DB Connection ───────────────────────────────────────────────
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);        // << matches .env
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// ─── Middlewares ────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/auth",          authRoute);
app.use("/api/users",         userRoute);
app.use("/api/gigs",          gigRoute);
app.use("/api/orders",        orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages",      messageRoute);
app.use("/api/reviews",       reviewRoute);

// ─── Error-handling Middleware ──────────────────────────────────
app.use((err, req, res, next) => {
  const status  = err.status  || 500;
  const message = err.message || "Something went wrong!";
  res.status(status).send(message);
});

// ─── Start Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connect();
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
/* ──────────────────────────────── EOF ────────────────────────── */
