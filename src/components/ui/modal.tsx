"use client";

import {
  useCallback,
  useRef,
  useEffect,
  MouseEventHandler,
  ElementRef,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XmarkIcon } from "@/components/ui/icons";

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef<ElementRef<"div">>(null);
  const wrapper = useRef<ElementRef<"div">>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed z-30 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60 backdrop-blur-sm"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="relative flex flex-col h-1/2 bg-background rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 lg:w-1/2"
      >
        <div className="absolute flex w-full justify-end p-1 top-0 right-0">
          <Button onClick={onDismiss} variant="ghost" className="px-1 h-6">
            <XmarkIcon />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
