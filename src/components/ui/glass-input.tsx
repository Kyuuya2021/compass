"use client";

import React, { forwardRef } from "react";
import { GlassEffect } from "./liquid-glass";

interface GlassInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(({ 
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyPress,
  className = "",
  icon,
  disabled = false
}, ref) => {
  return (
    <GlassEffect
      className={`rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02] ${className}`}
    >
      <div className="flex items-center px-4 py-3">
        {icon && (
          <div className="mr-3 text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 disabled:opacity-50"
        />
      </div>
    </GlassEffect>
  );
});

export { GlassInput }; 