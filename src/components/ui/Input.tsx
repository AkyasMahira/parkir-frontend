"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  startIcon?: React.ElementType;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, startIcon: Icon, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#71C9CE] transition-colors">
              <Icon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              "w-full bg-white/50 border border-transparent focus:bg-white focus:border-[#71C9CE] focus:ring-4 focus:ring-[#71C9CE]/10 rounded-2xl px-5 py-3.5 text-slate-800 placeholder:text-gray-400 outline-none transition-all duration-300 font-medium",
              Icon && "pl-12",
              error &&
                "border-red-400 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          />
        </div>

        {helperText && (
          <p
            className={cn(
              "text-xs ml-1",
              error ? "text-red-500" : "text-gray-400",
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
