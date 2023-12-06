import { Store } from "@/db/schema";
import DashboardStoreFrontDangerZone from "./store-front-danger-zone";
import DashboardStoreFrontGeneralZone from "./store-front-general-zone";

interface DashboardStoreSettingTabProps {
  store: Store;
}

export default function DashboardStoreFront({
  store,
}: DashboardStoreSettingTabProps) {
  return (
    <div className="w-full h-full">
      <DashboardStoreFrontGeneralZone store={store} />
      <DashboardStoreFrontDangerZone id={store.id} />
    </div>
  );
}
