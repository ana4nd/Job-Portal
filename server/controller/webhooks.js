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

    // Debug logs
    console.log("🔵 Raw Payload:", payload.toString());
    console.log("🔵 Headers:", headers);

    const event = wh.verify(payload, headers);
    const { data, type } = event;

    console.log("🟢 Event received:", type);

    switch (type) {
      case "user.created": {
        // Email fallback if none provided
        const hasEmail =
          Array.isArray(data.email_addresses) && data.email_addresses.length > 0;

        const email = hasEmail
          ? data.email_addresses[0].email_address
          : `${data.first_name || "no-name"}.${data.last_name || "user"}@noemail.com`;

        const userData = {
          _id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email,
          image: data.image_url || data.profile_image_url || "",
          resume: "",
        };

        console.log("🟢 Creating user:", userData);

        try {
          await User.create(userData);
          console.log("✅ User stored in MongoDB");
          return res.status(200).json({ success: true });
        } catch (dbError) {
          console.error("❌ MongoDB Error:", dbError.message);
          return res.status(500).json({ success: false, message: "DB Insert Failed" });
        }
      }

      case "user.updated": {
        const updatedEmail =
          Array.isArray(data.email_addresses) && data.email_addresses.length > 0
            ? data.email_addresses[0].email_address
            : "";

        const updatedData = {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: updatedEmail,
          image: data.image_url || data.profile_image_url || "",
        };

        console.log("🟡 Updating user:", updatedData);
        await User.findByIdAndUpdate(data.id, updatedData, { new: true });
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        console.log("🔴 Deleting user:", data.id);
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      default:
        console.log("⚠️ Unhandled event type:", type);
        return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error("❌ Webhook Handler Error:", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export { clerkWebhooks };
