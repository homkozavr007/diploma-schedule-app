import { useCallback, useEffect, useMemo, useState } from "react";
import { dateRangeToString, dateToString } from "@/utils/date-range-to-string";
import { useMainPageView } from "@/store/main-page-view/main-page-view";
import { MainPageViewTabNames } from "@/types/main-page-view-tabs";
import { DateRangePicker } from "../ui/date-range-picker";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEventsSearchParams } from "@/store/found-events/use-events-search-params";

export default function SearchControls() {
  const { range, search, patchEventsSearchParams } = useEventsSearchParams();
  const [textSearchValue, setTextSearchValue] = useState(search);
  const setTab = useMainPageView((state) => state.setTab);

  useEffect(() => {
    setTextSearchValue(search);
  }, [search]);

  const onUpdateHandler = useCallback(
    ({ range }: { range: { from: Date; to: Date | undefined } }) => {
      const [start, end] = dateRangeToString(range.from, range.to);
      patchEventsSearchParams({ start, end });
      setTab(MainPageViewTabNames.LIST);
    },
    [setTab, patchEventsSearchParams]
  );

  const searchButtonLoupe = useMemo(() => {
    return !textSearchValue || textSearchValue !== search;
  }, [textSearchValue, search]);

  const onTextSearchClickHandler = useCallback(() => {
    if (searchButtonLoupe) {
      patchEventsSearchParams({ search: textSearchValue });
      setTab(MainPageViewTabNames.LIST);
    } else {
      patchEventsSearchParams({ search: "" });
      setTab(MainPageViewTabNames.CALENDAR);
    }
  }, [textSearchValue, setTab, searchButtonLoupe, patchEventsSearchParams]);

  return (
    <>
      {range && (
        <DateRangePicker
          onUpdate={onUpdateHandler}
          initialDateFrom={dateToString(range.start)}
          initialDateTo={dateToString(range.end)}
          align="start"
          showCompare={false}
        />
      )}
      <div className="join mt-4 pr-4">
        <input
          className="input input-bordered join-item"
          placeholder="Text search"
          value={textSearchValue}
          onChange={(e) => setTextSearchValue(e.target.value)}
        />
        <button className="btn join-item" onClick={onTextSearchClickHandler}>
          <label className={`swap ${searchButtonLoupe && "swap-active"}`}>
            <MagnifyingGlassIcon className="w-5 h-5 swap-on" />
            <XMarkIcon className="w-5 h-5 swap-off" />
          </label>
        </button>
      </div>
    </>
  );
}
