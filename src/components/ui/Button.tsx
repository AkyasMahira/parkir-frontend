"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType; 
  fullWidth?: boolean; 
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      disabled,
      type = "button", 
      ...props
    },
    ref
  ) => {
    // Konfigurasi Style berdasarkan Varian
    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/30 border border-transparent",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent",
      outline:
        "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/30 border border-transparent",
    };

    // Konfigurasi Ukuran
    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2.5 gap-2 h-10",
      lg: "text-base px-6 py-3 gap-2.5 h-12",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          // Base Styles (Layout & Typography)
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",

          // Dynamic Styles
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "w-auto",

          // Focus Ring Colors based on variant
          variant === "danger" ? "focus:ring-red-500" : "focus:ring-blue-500",

          className
        )}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}

        {!isLoading && LeftIcon && (
          <LeftIcon
            className={cn(
              "shrink-0",
              size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
            )}
          />
        )}

        {/* Button Text */}
        <span className="truncate">
          {isLoading ? "Memproses..." : children}
        </span>

        {/* Right Icon */}
        {!isLoading && RightIcon && (
          <RightIcon
            className={cn(
              "shrink-0",
              size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
            )}
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
