"use server";

import {
  OrganizationEvent,
  OrganizationEventGoogleCalendar,
} from "../models/OrganizationEvent";
import { auth } from "../auth";

export async function createCalendarEvent(event: OrganizationEvent) {
  const session = await auth();

  const payload = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: event.start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: event.end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
  const data = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  return data.json();
}

export async function deleteCalendarEvent(eventId: string) {
  const session = await auth();
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    }
  );
}

export async function updateCalendarEvent(
  event: OrganizationEvent,
  calendarId: string
) {
  const session = await auth();

  const getResponse = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${calendarId}?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    }
  );

  const payload = await getResponse.json();

  payload.summary = event.title;
  payload.description = event.description;
  payload.start = {
    dateTime: event.start.toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  payload.end = {
    dateTime: event.end.toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const data = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${calendarId}?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  return data.json();
}
