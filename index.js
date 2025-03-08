import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import SignUpRoute from "./Routes/SignUpRoute.js";
import BooksRoute from "./Routes/FetchBooksRoute.js";

const app = express();
const PORT = 4444;
app.use(cors());
app.use(express.json());
app.use("/api", SignUpRoute);
app.use("/api",BooksRoute)
app.listen(PORT, () => {
  console.log(`Server is running successfully on ${PORT}`);
});


mongoose
  .connect(
    "mongodb+srv://boorgusiddharth:siddharthjuly99@siddharth.fiuilki.mongodb.net/?retryWrites=true&w=majority&appName=Siddharth"
  )
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log("Error connecting DB", err.message));
