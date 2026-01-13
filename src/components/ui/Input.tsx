"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ElementType;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      type = "text",
      startIcon: StartIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const currentType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    // Generate ID unik jika tidak ada
    const inputId =
      id ||
      `input-${
        label?.toLowerCase().replace(/\s+/g, "-") ||
        Math.random().toString(36).substr(2, 9)
      }`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {StartIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <StartIcon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={currentType}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm transition-all duration-200",
              "placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gray-100",
              StartIcon ? "pl-10" : "",
              isPasswordType ? "pr-10" : "",
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200 bg-red-50/50"
                : "border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-100",
              className
            )}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {error && (
          <div
            id={errorId}
            className="flex items-center gap-1.5 mt-1 text-red-600"
          >
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        {!error && helperText && (
          <p id={helperId} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
