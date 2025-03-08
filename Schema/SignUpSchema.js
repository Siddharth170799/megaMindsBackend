import mongoose from "mongoose"

const signUpSchema = new mongoose.Schema({
    Name:{type:String,required:true},
    Email:{type:String,required:true},
    Password:{type:String,required:true}
})

const SignUpSchema = mongoose.model("SignUpDetails",signUpSchema)
export default SignUpSchema