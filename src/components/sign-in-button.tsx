import { auth, signIn, signOut } from "@/auth";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { redirect } from "next/navigation";

export default async function SignInButton() {
  const session = await auth();
  return (
    <form
      action={async () => {
        "use server";
        if (session) {
          await signOut();
          return;
        }
        const url = await signIn(undefined, {
          redirectTo: "/",
          redirect: false,
        });
        // TODO: fix in next-auth
        redirect(url.replace("signin", "api/auth/signin"));
      }}
    >
      <button type="submit" className="btn btn-ghost w-full">
        {session ? (
          <>
            <ArrowRightOnRectangleIcon className="w-8 h-8" /> Sign Out
          </>
        ) : (
          <>
            <ArrowLeftOnRectangleIcon className="w-8 h-8" /> Sign In
          </>
        )}
      </button>
    </form>
  );
}
