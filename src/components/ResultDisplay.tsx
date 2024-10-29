import React from 'react';

interface ResultDisplayProps {
  result: number;
  label?: string;
  suffix?: string;
}

export function ResultDisplay({ result, label = 'Sonuç:', suffix = '' }: ResultDisplayProps) {
  return (
    <div className="p-4 bg-indigo-50 rounded-lg">
      <p className="text-center text-gray-800">
        <span className="font-medium">{label} </span>
        <span className="text-xl font-bold text-indigo-600">
          {result.toFixed(2)}{suffix}
        </span>
      </p>
    </div>
  );
}