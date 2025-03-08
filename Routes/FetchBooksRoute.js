import express from "express";
import { body, validationResult } from "express-validator";
import BookSchema from "../Schema/BookSchema.js";
import authMiddleware from "../middleWare/authMiddleWare.js";

const BooksRoute = express.Router();

BooksRoute.post(
  "/post/books",
  authMiddleware,

  [
    body("Title")
      .isString()
      .withMessage("Title must be a string")
      .notEmpty()
      .withMessage("Title is required"),
    body("Author")
      .isString()
      .withMessage("Author must be a string")
      .notEmpty()
      .withMessage("Author is required"),
  ],
  async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { Title, Author } = req.body;
      const book = new BookSchema({
        Title: Title,
        Author: Author,
        UserId: req.user.userId,
      });

      await book.save();

      const listOfBooks = await BookSchema.find({ UserId: req.user.userId });

      res.status(200).send({
        message: "Book saved successfully",
        status: 200,
        data: listOfBooks,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Error posting book to the db", status: 500 });
    }
  }
);

BooksRoute.get("/get/Books", authMiddleware, async (req, res) => {
  try {
    const listOfBooks = await BookSchema.find();
    res.status(200).send({
      message: "Books fetched successfully",
      data: listOfBooks,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching books", status: 500 });
  }
});

export default BooksRoute;
