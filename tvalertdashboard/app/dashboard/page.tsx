'use client' // This is a client component

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import TradesTable from '@/components/TradesTable'; // We will create this component
import StatsDisplay from '@/components/StatsDisplay'; // We will create this component
import FilterSection from '@/components/FilterSection'; // We will create this component
import { useSearchParams } from 'next/navigation'; // To read URL parameters for filtering

// Define the type for a trade row
interface Trade {
  id: string;
  trade_id: number;
  symbol: string;
  exchange: string | null;
  interval: string | null;
  alert_time: string; // ISO string
  action: string;
  price: number;
  pnl_pct: number | null;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();

  // Get filter parameters from URL
  const statusFilter = searchParams.get('status');
  // Add state for symbol and date filters here

  useEffect(() => {
    const fetchTrades = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('trades')
        .select('*')
        .order('alert_time', { ascending: false }); // Order by time

      // Apply status filter from URL
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      // Add other filters here (symbol, date range)

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trades:', error);
        setError(error.message);
      } else {
        setTrades(data || []);
      }
      setLoading(false);
    };

    fetchTrades();

    // Set up Realtime subscription
    const channel = supabase
      .channel('trades-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trades' },
        (payload) => {
          console.log('Realtime change received:', payload);
          // Handle different event types (INSERT, UPDATE, DELETE)
          // For simplicity, refetching all data or merging changes
          // A more efficient approach would be to merge changes into the existing state
          fetchTrades(); // Simple approach: refetch all data on any change
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };

  }, [statusFilter, supabase]); // Re-run effect if statusFilter changes

  // Calculate statistics
  const openTradesCount = trades.filter(trade => trade.status === 'open').length;
  const closedTradesCount = trades.filter(trade => trade.status === 'closed').length;
  const uniqueSymbolsCount = new Set(trades.map(trade => trade.symbol)).size;

  if (loading) return <div className="text-center">Loading trades...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">TradingView Alert Dashboard</h1>

      {/* Statistics Display */}
      <StatsDisplay
        openCount={openTradesCount}
        closedCount={closedTradesCount}
        uniqueSymbolsCount={uniqueSymbolsCount}
      />

      {/* Filter Section */}
      {/* Implement FilterSection component with state for symbol/date */}
      {/* <FilterSection onFilterChange={handleFilterChange} /> */}
      <div className="mb-6 p-4 bg-white rounded shadow">
         <h2 className="text-xl font-semibold mb-4">Filters</h2>
         {/* Placeholder for filter components */}
         <p>Implement Date/Time and Symbol filters here.</p>
         {/* Example: <input type="text" placeholder="Filter by Symbol" /> */}
      </div>


      {/* Trades Table */}
      <TradesTable trades={trades} />
    </div>
  );
}
