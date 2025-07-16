import { Webhook } from "svix";
import User from "../models/User.model.js";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = whook.verify(req.rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    console.log("✅ Webhook received");
 console.log("➡️ Type:", type);
 console.log("📦 Data:", data);


    console.log("Webhook received:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          resume: "",
          image: data.image_url,
        };

        await User.create(userData);
        console.log("User created:", userData);
        res.json({ success: true });
        break;
      }

      case "user.updated": {
        const userData = {
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          image: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        console.log("User updated:", data.id);
        res.json({ success: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("User deleted:", data.id);
        res.json({ success: true });
        break;
      }

      default:
        console.log("Unhandled event type:", type);
        res.status(200).end();
        break;
    }

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
