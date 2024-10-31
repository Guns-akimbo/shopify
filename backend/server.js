import express from "express";
const PORT = process.env.PORT || 5000;
const DB = process.env.DB;
import mongoose from "mongoose";
import product from "./routes/product.js";
import logger from "./middleware/loggermiddleware.js";
import error from "./middleware/error.js";
import notFound from "./middleware/not-found.js";
import cors from "cors";
import auth from "./routes/auth.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const __dirname = path.resolve();

// cors policy midddleware  handler
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// logger middleware
app.use(logger);

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // allow us parse incoming cookies

// routes
app.use("/api/v1/products", product);
app.use("/api/v1/auth", auth);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// error middleware
app.use(notFound);
app.use(error);

// Serve static files from the 'public' directory
app.use("/public", express.static("public"));

mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to database");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  })

  .catch((error) => {
    console.log("connection failed", error.message);
  });
