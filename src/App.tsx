import React from 'react';
import { ProfitCalculator } from './components/ProfitCalculator';
import { ComparisonCard } from './components/ComparisonCard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfitCalculator />
        <ComparisonCard />
      </div>
    </div>
  );
}

export default App;