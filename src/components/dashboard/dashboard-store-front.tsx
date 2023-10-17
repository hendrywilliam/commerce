"use client";

import { Store } from "@/db/schema";
import DashboardStoreFrontDangerZone from "./dashboard-store-front-danger-zone";
import DashboardStoreFrontGeneralZone from "./dashboard-store-front-general-zone";

interface DashboardStoreSettingTabProps {
  store: Store;
}

export default function DashboardStoreFront({
  store,
}: DashboardStoreSettingTabProps) {
  return (
    <div className="w-full h-full">
      <DashboardStoreFrontGeneralZone />
      <DashboardStoreFrontDangerZone id={store.id} />
    </div>
  );
}
