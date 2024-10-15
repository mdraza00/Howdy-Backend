import { Schema, model } from "mongoose";
const profilePhoto = new Schema({
  filename: String,
  fileAddress: String,
});

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  friends: { type: [String], default: [] },
  profilePhoto: profilePhoto,
  about: { type: String, default: "Hey there! I am using Howdy." },
});
userSchema.index({ username: 1 });
const User = model("User", userSchema);
export default User;
