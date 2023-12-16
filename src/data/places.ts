"use server";

import PlaceModel, {
  Organization,
  OrganizationInput,
} from "../models/Organization";
import { ObjectId } from "mongodb";
import { checkSessionAndConnect } from "./check-session-and-connect";

export async function createPlace(
  place: OrganizationInput
): Promise<Organization> {
  const user = await checkSessionAndConnect();
  const placeCreated: Organization = await PlaceModel.create<Organization>({
    ...place,
    userId: new ObjectId(user.id),
  });
  return placeCreated.toJSON({ flattenMaps: true });
}

export async function updatePlace(
  place: OrganizationInput & { _id: string }
): Promise<Organization> {
  const user = await checkSessionAndConnect();
  const placeUpdated: Organization | null = await PlaceModel.findOneAndUpdate(
    {
      _id: new ObjectId(place._id),
      userId: new ObjectId(user.id),
    },
    place,
    { new: true }
  ).lean();
  if (!placeUpdated) {
    throw new Error("Place not found");
  }
  return placeUpdated;
}

export async function deletePlace(id: string): Promise<void> {
  const user = await checkSessionAndConnect();
  const placeDeleted = await PlaceModel.findOneAndDelete({
    _id: new ObjectId(id),
    userId: new ObjectId(user.id),
  }).lean();
  if (!placeDeleted) {
    throw new Error("Place not found");
  }
}

export async function getUserPlaces(): Promise<Organization[]> {
  const user = await checkSessionAndConnect();
  const places: Organization[] = await PlaceModel.find({
    userId: new ObjectId(user.id),
  }).lean();
  return places;
}
