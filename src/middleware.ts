import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { normalizeDateRange } from "./utils/normalize-date-range";
import { startOfMonth } from "date-fns";

const authMiddleware = NextAuth(authConfig).auth;

export default authMiddleware((req) => {
  if (req.nextUrl.pathname.startsWith("/dashboard") && !req.auth) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // if (req.nextUrl.pathname === "/") {
  //   const searchParams = req.nextUrl.searchParams;
  //   console.log("req", req.headers);
  //   console.log(
  //     searchParams,
  //     "new date:",
  //     new Date(),
  //     startOfMonth(new Date())
  //   );
  //   const range = normalizeDateRange(
  //     searchParams.get("start") ?? null,
  //     searchParams.get("end") ?? null
  //   );
  //   console.log(range);
  //   const startDate = range.start.toISOString().split("T")[0];
  //   const endDate = range.end.toISOString().split("T")[0];
  //   if (
  //     startDate !== searchParams.get("start") ||
  //     endDate !== searchParams.get("end")
  //   ) {
  //     searchParams.set("start", startDate);
  //     searchParams.set("end", endDate);
  //     return NextResponse.redirect(
  //       new URL(`/?${searchParams.toString()}`, req.url)
  //     );
  //   }
  // }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/(dashboard.*)"],
};
