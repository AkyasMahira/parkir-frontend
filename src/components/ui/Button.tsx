import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  className,
  ...props
}) => {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={`w-full py-3 px-4 
        bg-primary hover:bg-primary-hover text-white font-semibold 
        rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
        disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center
        ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="animate-pulse">Memproses...</span>
      ) : (
        children
      )}
    </button>
  );
};
