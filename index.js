import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import SignUpRoute from "./Routes/SignUpRoute.js";
import BooksRoute from "./Routes/FetchBooksRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const DBString = process.env.DB_URI;
app.use(cors());
app.use(express.json());
app.use("/api", SignUpRoute);
app.use("/api",BooksRoute)

app.listen(PORT, () => {
  console.log(`Server is running successfully on ${PORT}`);
});

mongoose
  .connect(
    DBString
  )
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log("Error connecting DB", err.message));
