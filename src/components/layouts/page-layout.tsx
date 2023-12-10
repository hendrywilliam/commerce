import { PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col container h-full w-full py-8 gap-4">
      {children}
    </div>
  );
}
