"use client";
import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  variant?: 'default' | 'minimal' | 'fullscreen';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  variant = 'default',
  className = ''
}: LoadingSpinnerProps) {
  const spinnerSize = sizeClasses[size];

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className={`${spinnerSize} animate-spin text-blue-600`} />
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-6 ${size === 'xl' ? 'h-20 w-20' : 'h-16 w-16'}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className={`${size === 'xl' ? 'w-8 h-8' : 'w-6 h-6'} text-blue-600 animate-pulse`} />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
          <p className="text-gray-600">Please wait while we process your request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <div className="relative mb-4">
        <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${spinnerSize}`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-blue-600 animate-pulse`} />
        </div>
      </div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

// Specialized loading components
export function ProductLoadingSpinner() {
  return (
    <LoadingSpinner 
      size="xl" 
      message="Loading Amazing Products" 
      variant="fullscreen"
    />
  );
}

export function FormLoadingSpinner() {
  return (
    <LoadingSpinner 
      size="md" 
      message="Processing..." 
      variant="minimal"
    />
  );
}

export function ButtonLoadingSpinner() {
  return (
    <div className="flex items-center">
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      <span>Loading...</span>
    </div>
  );
}
