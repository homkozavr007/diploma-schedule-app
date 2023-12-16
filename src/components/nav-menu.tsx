"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BriefcaseIcon,
  BuildingLibraryIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import SearchControls from "./search-controls/SearchControls";

export default function NavMenu() {
  const pathName = usePathname();
  const session = useSession();

  return (
    <div>
      {pathName === "/" && (
        <>
          <div className="divider">Search events</div>
          <SearchControls />
          <div className="divider"></div>
        </>
      )}
      <ul className="menu menu-md w-full">
        {pathName === "/dashboard" && (
          <>
            <li key={"manage_organizations"}>
              <label htmlFor="right-side-drawer" className="w-full">
                <BuildingLibraryIcon className="w-5 h-5" /> My organizations
              </label>
            </li>
            <li key={"home"}>
              <Link href={"/"}>
                <HomeIcon className="w-5 h-5" /> Back to home
              </Link>
            </li>
          </>
        )}
        {pathName === "/" && session.status === "authenticated" && (
          <li key={"dashboard"}>
            <Link href={"/dashboard"}>
              <BriefcaseIcon className="w-5 h-5" /> My own calendars
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
