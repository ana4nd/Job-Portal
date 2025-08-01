import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,         // Clerk's user ID (e.g., "user_abc123") – string is correct
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,         // Enforces unique emails (good practice)
    },
    resume: {
      type: String,         // Optional resume field – fine
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,        // ✅ optional: adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);
export default User;
