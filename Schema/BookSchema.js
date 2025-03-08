import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    Title:{type:String,required:true},
    Author:{type:String,required:true},
    UserId:{type:String,required:true}
})

const BookSchema = mongoose.model("booksList",bookSchema)
export default BookSchema