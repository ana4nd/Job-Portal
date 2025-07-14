import mongoose from "mongoose";

//Function to connect to the MongoDb database

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb connected");
    } catch (error) {
        console.log(error);
    }
}

export default connectDb;