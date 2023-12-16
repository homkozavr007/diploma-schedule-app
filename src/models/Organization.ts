import mongoose, { Types } from "mongoose";

export interface Organization extends mongoose.Document {
  name: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  url: string;
  userId: Types.ObjectId;
}

const OrganizationSchema = new mongoose.Schema<Organization>({
  name: {
    type: String,
    required: [true, "Please provide a name for this organization."],
  },
  city: {
    type: String,
    required: [
      true,
      "Please provide the city where this organization is located.",
    ],
    maxlength: [60, "City cannot be more than 60 characters"],
  },
  address: {
    type: String,
    required: [true, "Please provide the address."],
  },
  phone: {
    type: String,
    required: [true, "Please provide the address."],
  },
  description: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
});

export default mongoose.models.Organization ||
  mongoose.model<Organization>("Organization", OrganizationSchema);

export type OrganizationInput = Pick<
  Organization,
  "name" | "city" | "address" | "phone" | "description" | "url"
>;
