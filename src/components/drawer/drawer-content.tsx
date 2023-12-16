import { auth } from "../../auth";
import { PlacesManagement } from "../places/places-management";

export default async function DrawerContent() {
  const session = await auth();
  return <>{!!session && <PlacesManagement />}</>;
}
