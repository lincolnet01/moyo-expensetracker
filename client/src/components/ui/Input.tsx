'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-moyo-gray-700">{label}</label>
      )}
      <input
        className={`input-field ${error ? 'border-moyo-red focus:ring-moyo-red' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-moyo-red">{error}</p>}
    </div>
  );
}
