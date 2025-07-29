import express from "express";
import { clerkWebhooks } from "../controller/webhooks.js";

const userRoutes = express.Router();

userRoutes.post("/webhooks", clerkWebhooks); // POST /api/user/webhooks

export default userRoutes;
