"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EventsSearchParams } from "./types/events-search-params";
import { normalizeDateRange } from "../../utils/normalize-date-range";
import { useCallback, useMemo } from "react";

export function useEventsSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const paramStart = searchParams.get("start");
  const paramEnd = searchParams.get("end");
  const search = (searchParams.get("search") ?? "").trim();
  const organization = (searchParams.get("organization") ?? "").trim();

  const patchEventsSearchParams = useCallback(
    (patch: Partial<EventsSearchParams>): void => {
      const newSearchParams = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(patch)) {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      }
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const range = useMemo(() => {
    if (paramStart && paramEnd) {
      return normalizeDateRange(paramStart, paramEnd);
    }
    return null;
  }, [paramStart, paramEnd]);

  const result = useMemo(() => {
    return { patchEventsSearchParams, range, search, organization };
  }, [patchEventsSearchParams, range, search, organization]);

  return result;
}
