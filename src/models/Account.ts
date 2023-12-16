import mongoose, { Types } from "mongoose";
import { ProviderType } from "next-auth/providers";

export interface Account extends mongoose.Document {
  access_token: string;
  id_token: string;
  expires_at: number;
  scope: string;
  token_type: "bearer";
  providerAccountId: string;
  provider: string;
  type: ProviderType;
  userId: Types.ObjectId;
}

const AccountSchema = new mongoose.Schema<Account>({
  access_token: {
    type: String,
    required: [true, "Please provide an access token."],
  },
  id_token: {
    type: String,
    required: [true, "Please provide an id token."],
  },
  expires_at: {
    type: Number,
    required: [true, "Please provide an expiration date."],
  },
  scope: {
    type: String,
    required: [true, "Please provide a scope."],
  },
  token_type: {
    type: String,
    enum: ["bearer"],
    required: [true, "Please provide a token type."],
  },
  providerAccountId: {
    type: String,
    required: [true, "Please provide a provider account id."],
  },
  provider: {
    type: String,
    required: [true, "Please provide a provider."],
  },
  type: {
    type: String,
    enum: ["oidc", "oauth", "email", "credentials"],
    required: [true, "Please provide a type."],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
});

export default mongoose.models.Account ||
  mongoose.model<Account>("Account", AccountSchema);
