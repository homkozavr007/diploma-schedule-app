"use server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "../auth";
import { Session, User } from "next-auth";

export async function checkSessionAndConnect(): Promise<User> {
  const session: Session | null = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  if (!session.user) {
    throw new Error("No user in session");
  }
  await dbConnect();
  return session.user;
}
