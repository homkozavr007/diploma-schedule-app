"use client";

import { searchEvents } from "@/data/organization-events";
import { useFoundEvents } from "@/store/found-events/found-events";
import { useEventsSearchParams } from "@/store/found-events/use-events-search-params";
import { useMainPageView } from "@/store/main-page-view/main-page-view";
import { MainPageViewTabNames } from "@/types/main-page-view-tabs";
import { adjustRangeToDayLimits } from "@/utils/adjust-range-to-day-limits";
import { normalizeDateRange } from "@/utils/normalize-date-range";
import { format } from "date-fns";
import React, { useEffect, useMemo } from "react";
import { useDebounce } from "usehooks-ts";

export default function SearchHandler({ children }: { children: any }) {
  const setEvents = useFoundEvents((state) => state.setEvents);
  const { patchEventsSearchParams, range, search, organization } =
    useEventsSearchParams();
  const tab = useMainPageView((state) => state.tab);
  const setTab = useMainPageView((state) => state.setTab);

  useEffect(() => {
    if (!range) {
      const newRange = normalizeDateRange(null, null);
      const startDate = format(newRange.start, "yyyy-MM-dd");
      const endDate = format(newRange.end, "yyyy-MM-dd");
      console.log("SearchHandler useEffect", startDate, endDate);
      patchEventsSearchParams({ start: startDate, end: endDate });
    }
  }, [range, patchEventsSearchParams]);

  useEffect(() => {
    if (tab === null) {
      if (search !== "") {
        setTab(MainPageViewTabNames.LIST);
      } else {
        setTab(MainPageViewTabNames.CALENDAR);
      }
    }
  }, [tab, setTab, search]);

  const fetchParameters = useMemo(
    () => ({
      search,
      organization,
      range,
    }),
    [range, search, organization]
  );
  const debouncedFetchParameters = useDebounce(fetchParameters, 150);

  useEffect(() => {
    (async () => {
      if (!debouncedFetchParameters.range) {
        return;
      }
      const adjustedRange = adjustRangeToDayLimits(
        debouncedFetchParameters.range
      );
      const events = await searchEvents(
        adjustedRange,
        debouncedFetchParameters.search,
        debouncedFetchParameters.organization
      );
      setEvents(events);
    })();
  }, [setEvents, debouncedFetchParameters]);

  return <>{children}</>;
}
