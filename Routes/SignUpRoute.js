import express from "express";
import SignUpSchema from "../Schema/SignUpSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const authenticateUser = async (email, password) => {
  const details = await SignUpSchema.findOne({ Email: email });

  if (!details) {
    console.log("User not found");
    return null; // Return null if user is not found
  }

  // Compare the entered password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, details.Password);

  if (!isPasswordValid) {
    console.log("Invalid password");
    return null; // Return null if password is incorrect
  }

  console.log("User authenticated successfully", details);
  return details; // Return user details if authentication succeeds
};

// const authenticateUser = async (user) => {
//   const details = await SignUpSchema.find({ Email: user });
//   return details;
// };
const SignUpRoute = express.Router();

SignUpRoute.post("/postSignUpDetails", async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;

    const signUpDetails = new SignUpSchema({
      Name: Name,
      Email: Email,
      Password: Password,
    });
    signUpDetails.save();
    res.send({ message: "SignUpdetails Posted Successfully", status: 200 });
  } catch (err) {
    res.send({ message: "Error Posting SignUpDetails", status: 500 });
  }
});

SignUpRoute.get("/getSignUpDetails", async (req, res) => {
  try {
    const fetchedDetails = await SignUpSchema.find();
    res.send({
      message: "Details Fecthed Successfully",
      fetchedDetails: fetchedDetails,
      status: 200,
    });
  } catch (err) {
    res.send({ message: "Error fetching Details", status: 500 });
  }
});

SignUpRoute.post("/loginDetails", async (req, res) => {

  try{
    const { Email,Password} = req.body;

    const userObject = await authenticateUser(Email,Password);
 
    if (userObject) {
      const userId = userObject._id.toString();
  
      const token = jwt.sign({ userId: userId }, "my_secret_key", {
        expiresIn: "1hr",
      });
      res.send({token});
    }else{
      res.send({message:"Incoorect Email or Password",status:500})
    } 
  }catch(err){
    res.send({message:"User Does Not Exist, Please Sign In",status:500})
  }
  
});




export default SignUpRoute;
