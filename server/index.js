import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./config/db.js";
import { clerkWebhooks } from "./controller/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import {clerkMiddleware} from "@clerk/express"

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();

// ✅ Raw body ONLY for /webhooks
app.use("/webhooks", express.raw({ type: "*/*" }));

app.use(cors());
app.use(express.json()); // ✅ JSON parsing for all other routes
app.use(clerkMiddleware());

connecDB();
await connectCloudinary();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes)
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
