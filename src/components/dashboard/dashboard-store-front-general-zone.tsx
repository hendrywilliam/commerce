import { Button } from "@/components/ui/button";

export default function DashboardStoreFrontGeneralZone() {
  return (
    <div className="flex flex-col mt-4 gap-1">
      <h1 className="font-bold text-xl border-b">General</h1>
      <div className="flex flex-col py-2 justify-between gap-2">
        <div>
          <p className="font-bold">Rename this store</p>
          <p>
            Rename your own store into more recognizeable name, so you can
            standoff against your competitor.
          </p>
        </div>
        <div className="flex justify-end">
          <Button>Confirm Changes</Button>
        </div>
      </div>
    </div>
  );
}
