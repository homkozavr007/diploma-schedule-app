"use server";

import { ObjectId } from "mongodb";
import OrganizationEventModel, {
  OrganizationEvent,
  OrganizationEventInput,
} from "../models/OrganizationEvent";
import { checkSessionAndConnect } from "./check-session-and-connect";
import { AdjustedDateRange } from "../types/adjusted-date-range";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
} from "../lib/google-calendar";
import { User } from "../models/User";
import dbConnect from "../lib/dbConnect";

export async function getMyOrganizationEvents(
  organizationId: string
): Promise<OrganizationEvent[]> {
  const user = await checkSessionAndConnect();
  const events: OrganizationEvent[] = await OrganizationEventModel.find({
    organization: new ObjectId(organizationId),
    owner: new ObjectId(user.id),
  }).lean();
  return events;
}

export async function createMyOrganizationEvent(
  organizationId: string,
  eventInput: OrganizationEventInput
): Promise<OrganizationEvent> {
  const user = await checkSessionAndConnect();
  const newEvent = await OrganizationEventModel.create({
    ...eventInput,
    organization: new ObjectId(organizationId),
    owner: new ObjectId(user.id),
  });
  return newEvent.toObject();
}

export async function updateMyOrganizationEvent(
  event: OrganizationEventInput & { _id: string }
): Promise<OrganizationEvent> {
  const user = await checkSessionAndConnect();
  const eventToUpdate = await OrganizationEventModel.findOne<OrganizationEvent>(
    {
      _id: new ObjectId(event._id),
      owner: new ObjectId(user.id),
    }
  );
  if (!eventToUpdate) {
    throw new Error("Event not found");
  }
  Object.assign(eventToUpdate, event);

  let index = -1;
  for await (const booking of eventToUpdate.bookings) {
    ++index;
    if (!booking.googleCalendar) {
      continue;
    }
    try {
      const googleCalendar = await updateCalendarEvent(
        eventToUpdate,
        booking.googleCalendar.id
      );
      eventToUpdate.bookings[index].googleCalendar = googleCalendar;
    } catch (e) {
      console.log("Error updating calendar event", e);
    }
  }
  await eventToUpdate.save();
  return eventToUpdate.toObject();
}

export async function deleteMyOrganizationEvent(id: string): Promise<void> {
  const user = await checkSessionAndConnect();
  const eventToDelete = await OrganizationEventModel.findOne<OrganizationEvent>(
    {
      _id: new ObjectId(id),
      owner: new ObjectId(user.id),
    }
  );
  if (!eventToDelete) {
    throw new Error("Event not found");
  }
  const bookingsToRemove = eventToDelete.bookings
    .filter((booking) => booking.googleCalendar)
    .map((booking) => deleteCalendarEvent(booking.googleCalendar!.id));

  await Promise.all(bookingsToRemove);

  await eventToDelete.deleteOne();
}

export async function getBookedUsersFromEventId(
  eventId: string
): Promise<User[]> {
  await dbConnect();
  const event = await OrganizationEventModel.aggregate([
    { $match: { _id: new ObjectId(eventId) } },
    { $unwind: "$bookings" },
    {
      $lookup: {
        from: "users", // replace with your actual User collection name
        localField: "bookings.user",
        foreignField: "_id",
        as: "bookings.user",
      },
    },
    { $unwind: "$bookings.user" },
    {
      $group: {
        _id: "$_id",
        users: { $push: "$bookings.user" },
      },
    },
  ]);

  return event[0].users;
}

// export async function searchEvents(
//   range: AdjustedDateRange,
//   textSearch: string | null = null,
//   organizationId: string | null = null
// ): Promise<OrganizationEvent[]> {
//   const condition = {
//     start: { $lt: range.end },
//     end: { $gt: range.start },
//   } as Record<string, any>;
//   if (textSearch) {
//     condition["$text"] = { $search: textSearch };
//   }
//   if (organizationId) {
//     condition["organization"] = new ObjectId(organizationId);
//   }
//   return OrganizationEventModel.find(condition, "-bookings.googleCalendar")
//     .populate("organization")
//     .sort({ start: 1 })
//     .lean();
// }

export async function searchEvents(
  range: AdjustedDateRange,
  textSearch: string | null = null,
  organizationId: string | null = null
): Promise<OrganizationEvent[]> {
  await dbConnect();
  const condition: object[] = [
    {
      range: {
        path: "start",
        lt: range.end,
      },
    },
    {
      range: {
        path: "end",
        gt: range.start,
      },
    },
  ];
  if (textSearch) {
    condition.push({
      text: {
        query: textSearch,
        path: {
          wildcard: "*",
        },
        fuzzy: {},
      },
    });
  }
  if (organizationId) {
    condition.push({
      equals: {
        path: "organization",
        value: new ObjectId(organizationId),
      },
    });
  }
  return OrganizationEventModel.aggregate([
    {
      $search: {
        index: "myFullTextSearch",
        compound: {
          must: condition,
        },
      },
    },
    {
      $lookup: {
        from: "organizations", // replace with your actual Organization collection name
        localField: "organization",
        foreignField: "_id",
        as: "organization",
      },
    },
    {
      $unwind: "$organization",
    },
    {
      $project: {
        "bookings.googleCalendar": 0,
      },
    },
  ]);
}

export async function bookEvent(
  eventId: string,
  userId: string
): Promise<OrganizationEvent> {
  const user = await checkSessionAndConnect();
  if (user.id !== userId) {
    throw new Error("User not authenticated");
  }
  const event = await OrganizationEventModel.findById<OrganizationEvent>(
    new ObjectId(eventId)
  );
  if (!event) {
    throw new Error("Event not found");
  }
  if (event.bookings.length >= event.slotsAvailable) {
    throw new Error("Event already booked");
  }
  let googleCalendar = null;
  try {
    googleCalendar = await createCalendarEvent(event);
  } catch (e) {
    console.log("Error creating calendar event", e);
  }
  event.bookings.push({ user: new ObjectId(userId), googleCalendar });
  await event.save();
  const eventToReturn =
    await OrganizationEventModel.findById<OrganizationEvent>(
      event._id,
      "-bookings.googleCalendar"
    ).lean();
  return eventToReturn as any;
}

export async function cancelEvent(
  eventId: string,
  userId: string
): Promise<OrganizationEvent> {
  const user = await checkSessionAndConnect();
  if (user.id !== userId) {
    throw new Error("User not authenticated");
  }
  const event = await OrganizationEventModel.findById<OrganizationEvent>(
    new ObjectId(eventId)
  );
  if (!event) {
    throw new Error("Event not found");
  }
  const index = event.bookings.findIndex(
    (booking) => booking.user.toString() === userId
  );
  if (index === -1) {
    throw new Error("User not booked");
  }
  const deleted = event.bookings.splice(index, 1);
  if (deleted[0].googleCalendar) {
    try {
      await deleteCalendarEvent(deleted[0].googleCalendar.id);
    } catch (e) {
      console.log("Error deleting calendar event", e);
    }
  }
  await event.save();
  const eventToReturn =
    await OrganizationEventModel.findById<OrganizationEvent>(
      event._id,
      "-bookings.googleCalendar"
    ).lean();
  return eventToReturn as any;
}
