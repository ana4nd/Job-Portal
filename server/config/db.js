import mongoose from "mongoose";

// Function to connect to the mongoDb database

const connectDB = async()=>{

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
   
}

export default connectDB;