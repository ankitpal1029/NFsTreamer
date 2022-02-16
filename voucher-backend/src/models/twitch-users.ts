import mongoose from "mongoose";

const TwitchUserSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  display_name: {
    type: String,
    required: true,
  },
  wallet_address: {
    type: String,
    required: false,
  },
  points: {
    type: Number,
    default: 0,
    required: true,
  },
  profile_image_url: {
    type: String,
    required: true,
  },
});

export default mongoose.model("TwitchUser", TwitchUserSchema);
