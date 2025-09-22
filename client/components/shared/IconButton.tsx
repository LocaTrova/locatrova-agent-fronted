import React from "react";
import { cn } from "@/lib/utils";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rounded?: "md" | "lg" | "full";
  variant?: "white" | "tinted";
};

export default function IconButton({
  className,
  rounded = "lg",
  variant = "white",
  ...props
}: IconButtonProps) {
  const base = "inline-flex items-center justify-center shrink-0 h-12 w-12 border shadow-sm";
  const shape = rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-lg" : "rounded-md";
  const styles =
    variant === "white"
      ? "bg-white border-slate-200"
      : "bg-white/80 backdrop-blur border border-white/30";
  return <button type="button" className={cn(base, shape, styles, className)} {...props} />;
}
