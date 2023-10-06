import { Button } from "@/components/ui/button";
import { IconCart, IconNotification } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AccountNavigation() {
  return (
    <div className="flex w-1/3 justify-end gap-2">
      <Button className="rounded-full" variant={"outline"} size={"icon"}>
        <IconNotification />
      </Button>
      <Button className="rounded-full" variant={"outline"} size={"icon"}>
        <IconCart />
      </Button>
      <Button variant={"outline"}>Sign in</Button>
      <Avatar>
        <AvatarImage src="/images/image-donald-duck.webp" />
        <AvatarFallback>HW</AvatarFallback>
      </Avatar>
    </div>
  );
}
