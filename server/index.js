import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./config/db.js";
import { clerkWebhooks } from "./controller/webhooks.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

// Initialize express
const app = express();

// Middleware
app.use(cors());

// ✅ Use JSON body parser for all other routes
app.use(express.json());

// Connect to MongoDB
connecDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/webhooks", clerkWebhooks);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
