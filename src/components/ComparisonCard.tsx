import React, { useState, useCallback } from 'react';
import { Percent, Calculator, ArrowRight } from 'lucide-react';
import { NumberInput } from './NumberInput';
import { calculatePercentages } from '../utils/calculations';
import { colors } from '../utils/theme';

export function ComparisonCard() {
  const [number, setNumber] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('');
  const [results, setResults] = useState<{
    basicResult: number | null;
    addResult: number | null;
    subtractResult: number | null;
  }>({
    basicResult: null,
    addResult: null,
    subtractResult: null
  });

  const handleCalculate = useCallback(() => {
    const results = calculatePercentages(number, percentage);
    setResults(results);
  }, [number, percentage]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-3 rounded-lg" style={{ backgroundColor: colors.secondary.DEFAULT }}>
          <Percent className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.primary.DEFAULT }}>
            Yüzde Hesaplama
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Herhangi bir sayının yüzdesini hesaplayın
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            label="Sayı"
            value={number}
            onChange={setNumber}
            placeholder="Örn: 100"
          />
          <NumberInput
            label="Yüzde (%)"
            value={percentage}
            onChange={setPercentage}
            placeholder="Örn: 25"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white hover:opacity-90"
          style={{ 
            backgroundColor: colors.secondary.DEFAULT,
            boxShadow: `0 2px 5px ${colors.secondary.light}40`
          }}
        >
          <Calculator className="w-5 h-5" />
          Hesapla
        </button>

        {results.basicResult !== null && (
          <div className="space-y-4">
            <div className="p-5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-center gap-3 text-lg">
                <span className="font-bold text-indigo-600">{number}</span>
                <span className="text-gray-500">sayısının</span>
                <span className="font-bold text-purple-600">%{percentage}'i</span>
              </div>
              <div className="text-center mt-3">
                <span className="text-3xl font-bold text-indigo-600">
                  {results.basicResult.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Sayıya Eklenince</span>
                  <ArrowRight className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-center">
                  <span className="text-xl font-bold text-green-600">
                    {results.addResult?.toFixed(2)}
                  </span>
                </p>
                <p className="text-center text-sm text-gray-500 mt-1">
                  ({number} + {results.basicResult?.toFixed(2)})
                </p>
              </div>

              <div className="p-4 rounded-lg bg-red-50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Sayıdan Çıkarılınca</span>
                  <ArrowRight className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-center">
                  <span className="text-xl font-bold text-red-600">
                    {results.subtractResult?.toFixed(2)}
                  </span>
                </p>
                <p className="text-center text-sm text-gray-500 mt-1">
                  ({number} - {results.basicResult?.toFixed(2)})
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2 mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">📝 Örnek Kullanımlar:</p>
              <ul className="space-y-1 list-disc pl-4">
                <li>KDV hesaplama (100₺ + %18 KDV)</li>
                <li>İndirim hesaplama (200₺ - %25 indirim)</li>
                <li>Kar marjı hesaplama (Maliyet + %40 kar)</li>
                <li>Komisyon hesaplama (Satış tutarının %10'u)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}