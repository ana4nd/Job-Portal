import './config/instrument.js'
import express, { urlencoded } from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import clerkWebhooks from './controller/webhooks.js';

// Initialize Express
const app = express()

// Middleware
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));


// Routes
app.get("/", (req,res)=>{
    res.send("API Working");
})

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

// PORT
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);


// connect DB

await connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});