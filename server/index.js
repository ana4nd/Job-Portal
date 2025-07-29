import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connecDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();
const PORT = process.env.PORT || 4000

// Initialize express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// connnect Database
connecDB();

// Routes
app.get("/", (req, res) => {
    res.send("Hello from server")
})

app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})