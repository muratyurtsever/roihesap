import React from 'react';

interface ExpenseInputProps {
  value: {
    amount: string;
    note: string;
  };
  onChange: (field: 'amount' | 'note', value: string) => void;
  currencySymbol: string;
  number: number;
  isPercentage?: boolean;
}

export function ExpenseInput({ value, onChange, currencySymbol, number, isPercentage }: ExpenseInputProps) {
  return (
    <div className="flex gap-3">
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Diğer Gider {number} {isPercentage ? '(%)' : ''}
        </label>
        <input
          type="number"
          value={value.amount}
          onChange={(e) => onChange('amount', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder={isPercentage ? '0.00 %' : `0.00 ${currencySymbol}`}
        />
      </div>
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Not
        </label>
        <input
          type="text"
          value={value.note}
          onChange={(e) => onChange('note', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Gider açıklaması..."
        />
      </div>
    </div>
  );
}