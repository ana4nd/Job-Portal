import { Webhook } from "svix";
import User from "../models/User.js";

// Clerk Webhook Handler
const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify the webhook signature
    const payload = req.body; // raw body is expected!
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await whook.verify(payload, headers);

    const { data, type } = JSON.parse(payload);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id, // Clerk user ID as string
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: "",
        };

        console.log("Creating user:", userData);

        await User.create(userData);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const updatedData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };

        console.log("Updating user:", updatedData);

        await User.findByIdAndUpdate(data.id, updatedData);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        console.log("Deleting user with ID:", data.id);
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ success: true, message: "Unhandled event type" });
    }

  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export { clerkWebhooks };
