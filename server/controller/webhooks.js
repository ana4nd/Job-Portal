import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body;
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // 🔍 Debug logs
    console.log("🔵 Headers received:", headers);
    console.log("🔵 Raw Payload Buffer:", payload.toString());

    const event = wh.verify(payload, headers);

    // 🔍 Parsed event
    console.log("🟢 Parsed event from Clerk:", JSON.stringify(event, null, 2));

    const { data, type } = event;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name} ${data.last_name}`.trim(),
          image: data.image_url || data.profile_image_url || "",
          resume: "",
        };

        console.log("🟢 Creating user:", userData);

        // Create in DB
        await User.create(userData);
        console.log("✅ User created successfully in MongoDB");

        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const updatedData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name} ${data.last_name}`.trim(),
          image: data.image_url || data.profile_image_url || "",
        };

        console.log("🟡 Updating user:", updatedData);

        await User.findByIdAndUpdate(data.id, updatedData, { new: true });
        console.log("✅ User updated in MongoDB");

        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        console.log("🔴 Deleting user with ID:", data.id);

        await User.findByIdAndDelete(data.id);
        console.log("✅ User deleted from MongoDB");

        return res.status(200).json({ success: true });
      }

      default:
        console.log("⚠️ Unhandled Clerk event type:", type);
        return res.status(200).json({ success: true, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export { clerkWebhooks };
