import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import { clerkWebhooks } from "./controllers/webhooks.controller.js";


const app = express();
dotenv.config();
// Connect Database
connectDB();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

app.post('/webhooks', clerkWebhooks);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

