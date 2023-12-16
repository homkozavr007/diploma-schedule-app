"use server";

import AccountModel, { Account } from "@/models/Account";
import { ObjectId } from "mongodb";
import { checkSessionAndConnect } from "./check-session-and-connect";

export async function getUserAccount(
  provider: string
): Promise<Account | null> {
  const user = await checkSessionAndConnect();
  const account: Account | null = await AccountModel.findOne({
    userId: new ObjectId(user.id),
    provider,
  }).lean();
  return account;
}
