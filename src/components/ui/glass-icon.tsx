"use client";

import React from "react";
import { GlassEffect } from "./liquid-glass";

interface GlassIconProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const GlassIcon: React.FC<GlassIconProps> = ({ 
  children, 
  onClick, 
  className = "" 
}) => {
  return (
    <GlassEffect
      className={`rounded-2xl p-2 transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-8 h-8">
        {children}
      </div>
    </GlassEffect>
  );
};

export { GlassIcon }; 