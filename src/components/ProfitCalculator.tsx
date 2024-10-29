import React, { useState, useCallback } from 'react';
import { DollarSign, Calculator } from 'lucide-react';
import { NumberInput } from './NumberInput';
import { CurrencySelect } from './CurrencySelect';
import { ExpenseInput } from './ExpenseInput';
import { currencies } from '../utils/currencies';
import { colors } from '../utils/theme';

interface VolumeROI {
  volume: number;
  totalRevenue: number;
  totalCosts: number;
  profit: number;
  roi: number;
}

interface ProfitResult {
  totalCosts: number;
  profit: number;
  profitMargin: number;
  roi: number;
  marketplaceFeeAmount: number;
  percentageExpensesAmount: number[];
  volumeAnalysis: VolumeROI[];
}

interface Expense {
  amount: string;
  note: string;
  isPercentage?: boolean;
}

const VOLUME_SCENARIOS = [10, 100, 1000, 10000];

export function ProfitCalculator() {
  const [currency, setCurrency] = useState<string>('TRY');
  const [salePrice, setSalePrice] = useState<string>('');
  const [productionCost, setProductionCost] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [marketplaceFeePercentage, setMarketplaceFeePercentage] = useState<string>('');
  const [advertisingCost, setAdvertisingCost] = useState<string>('');
  const [otherExpenses, setOtherExpenses] = useState<Expense[]>([
    { amount: '', note: '' },
    { amount: '', note: '' },
    { amount: '', note: '' },
    { amount: '', note: '' },
    { amount: '', note: '' },
    { amount: '', note: '', isPercentage: true },
    { amount: '', note: '', isPercentage: true },
    { amount: '', note: '', isPercentage: true }
  ]);
  const [results, setResults] = useState<ProfitResult | null>(null);

  const getCurrentCurrencySymbol = useCallback(() => {
    return currencies.find(c => c.code === currency)?.symbol || '₺';
  }, [currency]);

  const handleExpenseChange = (index: number, field: keyof Expense, value: string) => {
    setOtherExpenses(prev => prev.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    ));
  };

  const calculateVolumeAnalysis = (
    salePrice: number,
    fixedCosts: number,
    variableCostsPerUnit: number,
    percentageCosts: number
  ): VolumeROI[] => {
    return VOLUME_SCENARIOS.map(volume => {
      const totalRevenue = salePrice * volume;
      const totalVariableCosts = variableCostsPerUnit * volume;
      const totalPercentageCosts = (totalRevenue * percentageCosts) / 100;
      const totalCosts = fixedCosts + totalVariableCosts + totalPercentageCosts;
      const profit = totalRevenue - totalCosts;
      const roi = (profit / totalCosts) * 100;

      return {
        volume,
        totalRevenue,
        totalCosts,
        profit,
        roi: isFinite(roi) ? roi : 0
      };
    });
  };

  const calculateProfit = useCallback(() => {
    const sale = parseFloat(salePrice) || 0;
    const feePercentage = parseFloat(marketplaceFeePercentage) || 0;
    const marketplaceFeeAmount = (sale * feePercentage) / 100;

    const percentageExpensesAmount = otherExpenses.slice(5).map(expense => 
      expense.amount ? (sale * parseFloat(expense.amount)) / 100 : 0
    );

    // Fixed costs (advertising and fixed other expenses)
    const fixedCosts = [advertisingCost, ...otherExpenses.slice(0, 5).map(exp => exp.amount)]
      .map(cost => parseFloat(cost) || 0)
      .reduce((sum, cost) => sum + cost, 0);

    // Variable costs per unit (production and shipping)
    const variableCostsPerUnit = [productionCost, shippingCost]
      .map(cost => parseFloat(cost) || 0)
      .reduce((sum, cost) => sum + cost, 0);

    // Total percentage costs (marketplace fee + percentage expenses)
    const totalPercentage = feePercentage + 
      otherExpenses.slice(5)
        .map(exp => parseFloat(exp.amount) || 0)
        .reduce((sum, perc) => sum + perc, 0);

    const totalCosts = fixedCosts + variableCostsPerUnit + 
      marketplaceFeeAmount + percentageExpensesAmount.reduce((sum, amount) => sum + amount, 0);
    const profit = sale - totalCosts;
    const profitMargin = (profit / sale) * 100;
    const roi = (profit / totalCosts) * 100;

    const volumeAnalysis = calculateVolumeAnalysis(
      sale,
      fixedCosts,
      variableCostsPerUnit,
      totalPercentage
    );

    setResults({
      totalCosts,
      profit,
      profitMargin: isFinite(profitMargin) ? profitMargin : 0,
      roi: isFinite(roi) ? roi : 0,
      marketplaceFeeAmount,
      percentageExpensesAmount,
      volumeAnalysis
    });
  }, [
    salePrice,
    productionCost,
    shippingCost,
    marketplaceFeePercentage,
    advertisingCost,
    otherExpenses
  ]);

  const currencySymbol = getCurrentCurrencySymbol();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6" style={{ backgroundColor: colors.background.light }}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-3 rounded-lg" style={{ backgroundColor: colors.secondary.DEFAULT }}>
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.primary.DEFAULT }}>
            Karlılık Hesaplama
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Satış ve gider detaylarını girerek karlılık analizini hesaplayın
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <CurrencySelect value={currency} onChange={setCurrency} />
          <NumberInput
            label="Satış Fiyatı"
            value={salePrice}
            onChange={setSalePrice}
            placeholder={`0.00 ${currencySymbol}`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <NumberInput
            label="Üretim Maliyeti"
            value={productionCost}
            onChange={setProductionCost}
            placeholder={`0.00 ${currencySymbol}`}
          />
          <NumberInput
            label="Kargo Maliyeti"
            value={shippingCost}
            onChange={setShippingCost}
            placeholder={`0.00 ${currencySymbol}`}
          />
          <NumberInput
            label="Pazar Yeri Komisyonu (%)"
            value={marketplaceFeePercentage}
            onChange={setMarketplaceFeePercentage}
            placeholder="0.00 %"
          />
          <NumberInput
            label="Reklam Maliyeti"
            value={advertisingCost}
            onChange={setAdvertisingCost}
            placeholder={`0.00 ${currencySymbol}`}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium" style={{ color: colors.primary.DEFAULT }}>
              Diğer Giderler
            </h3>
            <div className="flex-1 border-b border-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherExpenses.map((expense, index) => (
              <ExpenseInput
                key={index}
                value={expense}
                onChange={(field, value) => handleExpenseChange(index, field, value)}
                currencySymbol={currencySymbol}
                number={index + 1}
                isPercentage={expense.isPercentage}
              />
            ))}
          </div>
        </div>

        <button
          onClick={calculateProfit}
          className="w-full py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white hover:opacity-90"
          style={{ 
            backgroundColor: colors.secondary.DEFAULT,
            boxShadow: `0 2px 5px ${colors.secondary.light}40`
          }}
        >
          <Calculator className="w-5 h-5" />
          Hesapla
        </button>

        {results && (
          <div className="space-y-4 mt-6">
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.background.DEFAULT }}>
              <p className="text-center text-gray-800">
                <span className="font-medium">Toplam Maliyet: </span>
                <span className="text-xl font-bold" style={{ color: colors.primary.dark }}>
                  {currencySymbol}{results.totalCosts.toFixed(2)}
                </span>
              </p>
              {parseFloat(marketplaceFeePercentage) > 0 && (
                <p className="text-center text-gray-600 text-sm mt-2">
                  <span className="font-medium">Pazar Yeri Komisyonu: </span>
                  <span className="font-bold">
                    {currencySymbol}{results.marketplaceFeeAmount.toFixed(2)}
                  </span>
                  <span className="text-gray-500"> ({marketplaceFeePercentage}%)</span>
                </p>
              )}
              {otherExpenses.slice(5).map((expense, index) => (
                expense.amount && expense.note && (
                  <p key={index} className="text-center text-gray-600 text-sm mt-1">
                    <span className="font-medium">{expense.note}: </span>
                    <span className="font-bold">
                      {currencySymbol}{results.percentageExpensesAmount[index].toFixed(2)}
                    </span>
                    <span className="text-gray-500"> ({expense.amount}%)</span>
                  </p>
                )
              ))}
              {otherExpenses.slice(0, 5).some(exp => exp.amount && exp.note) && (
                <div className="mt-3 text-sm text-gray-600">
                  <p className="font-medium mb-1">Diğer Gider Notları:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-2">
                    {otherExpenses.slice(0, 5).map((exp, index) => (
                      exp.amount && exp.note && (
                        <p key={index} className="truncate">
                          • {exp.note}: {currencySymbol}{parseFloat(exp.amount).toFixed(2)}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-lg ${
                results.profit >= 0 ? 'bg-success-light/10' : 'bg-red-50'
              }`}>
                <p className="text-center">
                  <span className="font-medium">Net Kar/Zarar: </span>
                  <span className={`text-xl font-bold ${
                    results.profit >= 0 ? 'text-success-DEFAULT' : 'text-red-600'
                  }`}>
                    {currencySymbol}{results.profit.toFixed(2)}
                  </span>
                </p>
              </div>

              <div className={`p-6 rounded-lg ${
                results.profitMargin >= 0 ? 'bg-success-light/10' : 'bg-red-50'
              }`}>
                <p className="text-center">
                  <span className="font-medium">Kar Marjı: </span>
                  <span className={`text-xl font-bold ${
                    results.profitMargin >= 0 ? 'text-success-DEFAULT' : 'text-red-600'
                  }`}>
                    %{results.profitMargin.toFixed(2)}
                  </span>
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  (Net Kar / Satış Fiyatı)
                </p>
              </div>

              <div className={`p-6 rounded-lg ${
                results.roi >= 0 ? 'bg-success-light/10' : 'bg-red-50'
              }`}>
                <p className="text-center">
                  <span className="font-medium">ROI: </span>
                  <span className={`text-xl font-bold ${
                    results.roi >= 0 ? 'text-success-DEFAULT' : 'text-red-600'
                  }`}>
                    %{results.roi.toFixed(2)}
                  </span>
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  (Net Kar / Toplam Maliyet)
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.primary.DEFAULT }}>
                Hacim Bazlı ROI Analizi
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Satış Adedi</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Toplam Gelir</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Toplam Maliyet</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Net Kar</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.volumeAnalysis.map((analysis, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {analysis.volume.toLocaleString()} adet
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-800">
                          {currencySymbol}{analysis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-800">
                          {currencySymbol}{analysis.totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 text-right text-sm font-medium ${
                          analysis.profit >= 0 ? 'text-success-DEFAULT' : 'text-red-600'
                        }`}>
                          {currencySymbol}{analysis.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 text-right text-sm font-medium ${
                          analysis.roi >= 0 ? 'text-success-DEFAULT' : 'text-red-600'
                        }`}>
                          %{analysis.roi.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}