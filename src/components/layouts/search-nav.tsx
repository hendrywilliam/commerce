import { Button } from "@/components/ui/button";

export default function SearchNavigation() {
  return (
    <div className="flex w-1/3 justify-center">
      <Button variant={"outline"} className="flex w-full gap-1">
        Search
      </Button>
    </div>
  );
}
