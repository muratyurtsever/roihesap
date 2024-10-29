import React from 'react';
import { Calculator } from 'lucide-react';

interface CalculatorCardProps {
  title: string;
  children: React.ReactNode;
}

export function CalculatorCard({ title, children }: CalculatorCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}