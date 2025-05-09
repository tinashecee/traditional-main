import * as React from "react";
import { cn } from "@/lib/utils";

interface SnackbarProps {
  message: string;
  variant?: "default" | "success" | "error";
  open: boolean;
  onClose: () => void;
  duration?: number;
}

export function Snackbar({
  message,
  variant = "default",
  open,
  onClose,
  duration = 3000,
}: SnackbarProps) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[9999] p-4 rounded-md shadow-lg transition-all transform", // Updated z-index
        variant === "success" && "bg-green-500 text-white",
        variant === "error" && "bg-red-500 text-white",
        variant === "default" && "bg-gray-800 text-white"
      )}>
      {message}
    </div>
  );
}
