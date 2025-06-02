import React from 'react';

interface StatsDisplayProps {
  openCount: number;
  closedCount: number;
  uniqueSymbolsCount: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ openCount, closedCount, uniqueSymbolsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow text-center">
        <div className="text-2xl font-bold">{openCount}</div>
        <div className="text-sm text-gray-500">Open Trades</div>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <div className="text-2xl font-bold">{closedCount}</div>
        <div className="text-sm text-gray-500">Closed Trades</div>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <div className="text-2xl font-bold">{uniqueSymbolsCount}</div>
        <div className="text-sm text-gray-500">Unique Symbols</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
