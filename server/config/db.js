import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Function to connect to the mongoDb database

const connectDB = async()=>{
    mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{
            console.log("Database connected");
        })
        .catch((err)=>{
            console.log(err)
        })
}

export default connectDB;