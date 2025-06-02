import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

// Helper to assign sequential TradeID per symbol
async function getNextTradeId(symbol: string) {
  const { data, error } = await supabase
    .from('trades')
    .select('trade_id')
    .eq('symbol', symbol)
    .order('trade_id', { ascending: false })
    .limit(1);
  if (error) return 1;
  return data && data.length > 0 ? data[0].trade_id + 1 : 1;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ticker: symbol,
      exchange,
      interval,
      alerttimestamp,
      strategyAction: action_type,
      strategyPrice: price,
    } = body;

    // Assign sequential TradeID per symbol
    const trade_id = await getNextTradeId(symbol);

    // Check for open trade to close
    const { data: openTrade } = await supabase
      .from('trades')
      .select('*')
      .eq('symbol', symbol)
      .eq('status', 'open')
      .order('alert_time', { ascending: true })
      .limit(1)
      .single();

    let status = 'open';
    let pnl_pct = null;

    if (openTrade) {
      // Mark both as closed and compute P&L
      status = 'closed';
      pnl_pct = ((Number(price) - Number(openTrade.price)) / Number(openTrade.price)) * 100;
      // Update the open trade
      await supabase
        .from('trades')
        .update({ status: 'closed', pnl_pct })
        .eq('id', openTrade.id);
    }

    // Insert the new trade
    const { error } = await supabase.from('trades').insert([
      {
        trade_id,
        action_type,
        symbol,
        exchange,
        interval,
        alert_time: new Date(alerttimestamp),
        action: action_type,
        price,
        status,
        pnl_pct,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
