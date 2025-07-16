import './config/instrument.js';
import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import clerkWebhooks from './controller/webhooks.js';

const app = express();
dotenv.config();

await connectDB(); // DB first

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Raw body middleware ONLY for Clerk webhooks
app.use("/webhooks", express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
