import { IconImagePlaceholder } from "@/components/ui/icons";

export default function ImagePlaceholder() {
  return (
    <div className="flex w-full h-full items-center justify-center bg-muted">
      <IconImagePlaceholder width={30} height={30} />
    </div>
  );
}
