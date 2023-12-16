import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./globals.css";
import SideMenu from "@/components/side-menu/side-menu";
import DrawerContent from "@/components/drawer/drawer-content";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "yaBudu calendar application",
  description: "Allows booking events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="drawer drawer-end">
            <input
              id="right-side-drawer"
              type="checkbox"
              className="drawer-toggle"
            />
            <div className="drawer-content flex h-screen flex-col md:flex-row md:overflow-hidden">
              <div className="w-80 border-r-2 border-gray-100">
                <SideMenu />
              </div>
              <div className="flex-grow overflow-y-auto">{children}</div>
            </div>
            <div className="drawer-side z-10 overflow-hidden">
              <label
                htmlFor="right-side-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <div className="w-80 min-h-full h-full bg-base-200 text-base-content">
                <DrawerContent />
              </div>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
