"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import { serverSignOut } from "@/utils/server-sign-out";

export default function SignOutMenuItem() {
  let [_, startTransition] = useTransition();
  return (
    <a
      className="w-full"
      type="submit"
      onClick={() =>
        startTransition(async () => {
          await serverSignOut();
        })
      }
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5" /> Sign out
    </a>
  );
}
