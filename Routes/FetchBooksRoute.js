import express from "express";
import BookSchema from "../Schema/BookSchema.js";

import authMiddleware from "../middleWare/authMiddleWare.js";

const BooksRoute = express.Router();

BooksRoute.post("/post/books", authMiddleware, async (req, res) => {
    console.log(req.user)
  try {
    const { title, author } = req.body;
    const book = new BookSchema({
      Title: title,
      Author: author,
      UserId: req.user.userId,
    });

    await book.save();
    res.send({ message: "Book saved successfully", status: 200 });
  } catch (err) {
    console.error(err);
    res.send({ message: "Error posting book to the db", status: 500 });
  }
});

BooksRoute.get("/get/Books", authMiddleware, async (req, res) => {
  try {
    const listOfBooks = await BookSchema.find();
    res.send({
      message: "books fetched successfully",
      data: listOfBooks,
      status: 200,
    });
  } catch (err) {
    res.send({ message: "Error fetching books", status: 500 });
  }
});
export default BooksRoute;


