import express from "express";
import SignUpSchema from "../Schema/SignUpSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
const authenticateUser = async (email, password) => {
  const details = await SignUpSchema.findOne({ Email: email });

  if (!details) {
    console.log("User not found");
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, details.Password);

  if (!isPasswordValid) {
    console.log("Invalid password");
    return null;
  }

  console.log("User authenticated successfully", details);
  return details;
};

const SignUpRoute = express.Router();

SignUpRoute.post(
  "/postSignUpDetails",
   [
    body("Name")
      .isString()
      .withMessage("Name must be a string")
      .notEmpty()
      .withMessage("Name is required"),
    body("Email")
      .isEmail()
      .withMessage("Invalid email format")
      .notEmpty()
      .withMessage("Email is required"),
    body("Password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { Name, Email, Password } = req.body;

      const signUpDetails = new SignUpSchema({
        Name: Name,
        Email: Email,
        Password: Password, 
      });
      await signUpDetails.save();
      res
        .status(200)
        .send({ message: "SignUp details posted successfully", status: 200 });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Error posting sign-up details", status: 500 });
    }
  }
);

SignUpRoute.get("/getSignUpDetails", async (req, res) => {
  try {
    const fetchedDetails = await SignUpSchema.find();
    res.send({
      message: "Details Fetched Successfully",
      fetchedDetails: fetchedDetails,
      status: 200,
    });
  } catch (err) {
    res.send({ message: "Error fetching Details", status: 500 });
  }
});

SignUpRoute.post(
  "/loginDetails",
  [
    body("Email")
      .isEmail()
      .withMessage("Invalid email format")
      .notEmpty()
      .withMessage("Email is required"),
    body("Password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const { Email, Password } = req.body;

      const userObject = await authenticateUser(Email, Password);

      if (userObject) {
        const userId = userObject._id.toString();

        const token = jwt.sign({ userId: userId }, "my_secret_key", {
          expiresIn: "1hr",
        });
        res.send({ token });
      } else {
        res.send({ message: "Incoorect Email or Password", status: 500 });
      }
    } catch (err) {
      res.send({ message: "User Does Not Exist, Please Sign In", status: 500 });
    }
  }
);

export default SignUpRoute;
