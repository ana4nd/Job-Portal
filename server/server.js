import './config/instrument.js';
import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import clerkWebhooks from './controller/webhooks.js';

dotenv.config();
await connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // For all non-webhook routes
app.use(urlencoded({ extended: true }));

// ❗️ Handle Clerk webhook with raw-body capture:
app.post(
  "/webhooks",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }),
  clerkWebhooks
);

app.get("/", (req, res) => res.send("API Working"));
app.get("/debug-sentry", () => { throw new Error("Sentry test"); });

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
