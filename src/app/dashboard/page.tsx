import { OrganizationSelector } from "../../components/OrganizationSelector";
import OrganizationsCalendar from "../../components/calendar/organizations-calendar";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="navbar bg-base-100 shadow-sm shadow-gray-300 z-10">
        <div className="flex-1">
          <OrganizationSelector />
        </div>
      </div>
      <OrganizationsCalendar />
    </div>
  );
}
