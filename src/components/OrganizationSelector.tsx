"use client";

import { useCallback, useEffect } from "react";
import { useUserPlacesListStore } from "./places/store/user-places-list-store";
import { getMyOrganizationEvents } from "@/data/organization-events";
import { useOrganizationEventsStore } from "../store/organization-events-store/organization-events-store";

export function OrganizationSelector() {
  const organizations = useUserPlacesListStore((state) => state.places);
  const selectedPlaceId = useUserPlacesListStore(
    (state) => state.selectedPlaceId
  );
  const setSelected = useUserPlacesListStore((state) => state.setSelected);

  const onSelectHandler = useCallback(
    ({ target: { value } }: any) => {
      setSelected(value);
    },
    [setSelected]
  );

  const setEvents = useOrganizationEventsStore((state) => state.setEvents);

  useEffect(() => {
    console.log("selectedPlaceId", selectedPlaceId);
    const loadEvents = async () => {
      if (!selectedPlaceId) return;
      const response = await getMyOrganizationEvents(selectedPlaceId);
      setEvents(response);
      console.log("events", response);
    };
    loadEvents().catch(console.error);
  }, [selectedPlaceId, setEvents]);

  useEffect(() => {
    if (organizations.length === 0) {
      setSelected(null);
      return;
    }
    if (!selectedPlaceId) {
      setSelected(organizations[0]._id);
      return;
    }
  }, [selectedPlaceId, organizations, setSelected]);

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={onSelectHandler}
      value={selectedPlaceId ?? undefined}
    >
      <option disabled selected>
        Select your organization
      </option>
      {organizations.map((org) => (
        <option key={org._id} value={org._id}>
          {org.name}
        </option>
      ))}
    </select>
  );
}
