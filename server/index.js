import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./config/db.js";
import { clerkWebhooks } from "./controller/webhooks.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();

// ✅ Raw body ONLY for /webhooks
app.use("/webhooks", express.raw({ type: "*/*" }));

app.use(cors());
app.use(express.json()); // ✅ JSON parsing for all other routes

connecDB();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/webhooks", clerkWebhooks);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
