import { auth } from "@/auth";
import AuthenticatedUserDisplay from "../authenticated-user-display";
import NavMenu from "../nav-menu";
import SignInButton from "../sign-in-button";

export default async function SideMenu() {
  const session = await auth();
  return (
    <div className="flex flex-col w-full h-full">
      {session && (
        <div className="p-2">
          <AuthenticatedUserDisplay user={session!.user!} />
        </div>
      )}
      <div className="p-2 grow">
        <NavMenu />
      </div>
      <div>
        <SignInButton />
      </div>
    </div>
  );
}
