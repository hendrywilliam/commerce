import { Toaster as CustomToast } from "sonner";

type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

interface ToastOptions {
  className?: string;
  descriptionClassName?: string;
  style?: React.CSSProperties;
  duration?: number;
}

interface ToasterProps {
  invert?: boolean;
  theme?: "light" | "dark" | "system";
  position?: Position;
  hotkey?: string[];
  richColors?: boolean;
  expand?: boolean;
  duration?: number;
  visibleToasts?: number;
  closeButton?: boolean;
  toastOptions?: ToastOptions;
  className?: string;
  style?: React.CSSProperties;
  offset?: string | number;
  dir?: "rtl" | "ltr" | "auto";
}

export default function Toast({ position, ...props }: ToasterProps) {
  return <CustomToast position="bottom-right" {...props} />;
}
