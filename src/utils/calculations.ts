export interface PercentageResult {
  basicResult: number | null;
  addResult: number | null;
  subtractResult: number | null;
}

export interface ComparisonResult {
  percentageOf: number | null;
  changeRate: number | null;
}

export function calculatePercentages(
  baseNumber: string,
  percentage: string
): PercentageResult {
  const base = parseFloat(baseNumber);
  const perc = parseFloat(percentage);
  
  if (isNaN(base) || isNaN(perc)) {
    return {
      basicResult: null,
      addResult: null,
      subtractResult: null
    };
  }

  const basicResult = (base * perc) / 100;
  const addResult = base + basicResult;
  const subtractResult = base - basicResult;

  return {
    basicResult,
    addResult,
    subtractResult
  };
}

export function calculateComparisons(
  numberA: string,
  numberB: string
): ComparisonResult {
  const a = parseFloat(numberA);
  const b = parseFloat(numberB);
  
  if (isNaN(a) || isNaN(b) || b === 0) {
    return {
      percentageOf: null,
      changeRate: null
    };
  }

  const percentageOf = (a / b) * 100;
  const changeRate = ((a - b) / b) * 100;

  return {
    percentageOf,
    changeRate
  };
}