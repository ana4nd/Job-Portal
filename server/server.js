import './config/instrument.js';
import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDb from "./config/db.js";
import * as Sentry from "@sentry/node";
import clerkWebhooks from './controller/webhooks.js';

// Initialize Express
const app = express();

const PORT = 3000 || process.env.PORT

await connectDb();

Sentry.setupExpressErrorHandler(app);

// connect to database 



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})