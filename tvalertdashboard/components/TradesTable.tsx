'use client'

import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import moment from 'moment'; // For time formatting

// Define the type for a trade row (should match the one in dashboard/page.tsx)
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

interface TradesTableProps {
  trades: Trade[];
}

// Helper function to calculate Time Lapse
const calculateTimeLapse = (alertTime: string): string => {
  const now = moment();
  const alertMoment = moment(alertTime);
  const duration = moment.duration(now.diff(alertMoment));

  // Format duration (e.g., "2h 30m 15s")
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let formatted = '';
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0) formatted += `${minutes}m `;
  formatted += `${seconds}s`;

  return formatted.trim();
};

// Helper function to calculate Live P&L (Placeholder - requires fetching current price)
const calculateLivePnl = (trade: Trade): string => {
  if (trade.status === 'closed' && trade.pnl_pct !== null) {
    return `${trade.pnl_pct.toFixed(2)}% (Closed)`;
  }

  // TODO: Implement fetching current market price for trade.symbol
  // For now, return a placeholder or calculate based on a dummy price
  const currentPrice = null; // Replace with actual price fetch logic

  if (currentPrice !== null) {
     const pnl = ((currentPrice - trade.price) / trade.price) * 100;
     return `${pnl.toFixed(2)}% (Live)`;
  }

  return 'N/A (Open)'; // Or 'Fetching...'
};


const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {

  // Define columns for the table
  const columns = useMemo<ColumnDef<Trade>[]>(
    () => [
      {
        accessorKey: 'trade_id',
        header: 'Trade ID',
      },
      {
        accessorKey: 'symbol',
        header: 'Symbol',
      },
      {
        accessorKey: 'exchange',
        header: 'Exchange',
      },
      {
        accessorKey: 'interval',
        header: 'Interval',
      },
      {
        accessorKey: 'alert_time',
        header: 'Alert Time',
        cell: info => moment(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        accessorKey: 'action',
        header: 'Action',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: info => (info.getValue() as number).toFixed(2),
      },
      {
        id: 'time_lapse', // Custom column
        header: 'Time Lapse',
        cell: ({ row }) => calculateTimeLapse(row.original.alert_time),
      },
      {
        id: 'pnl_pct', // Use ID for custom column
        header: 'P&L %',
        cell: ({ row }) => calculateLivePnl(row.original), // Use the helper function
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    []
  );

  const table = useReactTable({
    data: trades,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Add sorting, filtering, pagination models here
  });

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesTable;
