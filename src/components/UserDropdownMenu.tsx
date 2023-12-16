"use client";

import { HomeIcon } from "@heroicons/react/20/solid";
import SignOutMenuItem from "./sign-out-menu-item";
import { BriefcaseIcon, BuildingLibraryIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function UserDropdownMenu() {
  const pathName = usePathname();

  let menuItems = [] as React.ReactNode[];
  if (pathName === "/") {
    menuItems = [
      <li key={"dashboard"}>
        <Link href={"/dashboard"}>
          <BriefcaseIcon className="w-5 h-5" /> Dashboard
        </Link>
      </li>,
    ];
  } else if (pathName.startsWith("/dashboard")) {
    menuItems = [
      <li key={"home"}>
        <Link href={"/"}>
          <HomeIcon className="w-5 h-5" /> Back to home
        </Link>
      </li>,
      <li key={"manage_organizations"}>
        <label htmlFor="right-side-drawer" className="w-full">
          <BuildingLibraryIcon className="w-5 h-5" /> My organizations
        </label>
      </li>,
    ];
  }
  return (
    <ul
      tabIndex={0}
      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      {menuItems}
      <li>
        <SignOutMenuItem />
      </li>
    </ul>
  );
}
