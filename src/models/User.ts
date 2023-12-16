import mongoose from "mongoose";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  image: string;
  emailVerified: Date | null;
}

const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: [true, "Please provide a user name."],
  },
  email: {
    type: String,
    required: [true, "Please provide the user email."],
  },
  image: {
    type: String,
    required: [true, "Please provide the user avatar url."],
  },
  emailVerified: {
    type: Date,
    required: false,
    default: null,
  },
});

export default mongoose.models.Organization ||
  mongoose.model<User>("User", UserSchema);
