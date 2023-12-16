import { MainPageViewTabs } from "@/components/main-page-view-tabs/MainPageViewTabs";
import SearchHandler from "@/components/search-controls/SearchHandler";

export default async function Page() {
  return (
    <SearchHandler>
      <MainPageViewTabs />
    </SearchHandler>
  );
}
