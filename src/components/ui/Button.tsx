"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-[#71C9CE] to-[#A6E3E9] text-white hover:shadow-lg hover:shadow-[#71C9CE]/40 border-0",
      secondary:
        "bg-white text-slate-600 hover:bg-gray-50 border border-gray-100 shadow-sm",
      outline:
        "bg-transparent border-2 border-[#71C9CE] text-[#71C9CE] hover:bg-[#71C9CE] hover:text-white",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && (
              <span className="flex items-center">{rightIcon}</span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
