# TradingView Alert Dashboard


Overview

This project is a custom external TradingView Alert Dashboard built with Next.js, TypeScript, Tailwind CSS, and Supabase. It receives TradingView alerts via webhooks and displays them in a searchable, filterable table. . It will recieve message inputs (as JSON) from the alerts generated and preconfigured in tradingview through a webhook. You can know more about this at https://www.tradingview.com/support/solutions/43000529348/. The dashboard will display a table showing :

TradeID

ActionType


Symbol


Exchange


Interval


Alert Time


Action


Price


Time Lapse (now() - alert_time, formatted)


P&L % (pnl_pct or live (currentPrice - price)/price*100)


Status (open/closed)


Below is a complete end-to-end blueprint for a custom external TradingView Alert Dashboard that ingests your TradingView webhooks, persists them, computes live metrics (time-lapse, P&L, status) and exposes them in a searchable, filterable table

High-level Data Flow
TradingView fires your alert → POSTS JSON to your
Webhook Receiver (e.g. POST /api/alerts)

Webhook Receiver
 • Parses the payload (ticker, exchange, interval, alerttimestamp, strategyAction, strategyPrice)
 • Assigns a sequential TradeID per symbol
 • Inserts or updates a “trades” record in your database

Processing Logic (on insert):
 • If this is the complementary side of an existing “open” trade → mark both rows as closed, compute P&L (%)
 • Otherwise leave as open


Frontend Dashboard
 • Queries your API (GET /api/trades)
 • Renders a table with live Time-Lapse and P&L calculations for each row
 • Allows filtering/sorting by symbol, status, P&L, etc.


Workflow sketch
Express receives POST at /api/alerts, writes to Postgres.

On write, a trigger or an AFTER INSERT hook in Node checks for a matching open trade:
If found, updates both rows (status & pnl_pct).

React App queries GET /api/trades?status=open on load, then polls every 5–10 s or connects to a Socket.io channel for “trade-updated” events.

DataGrid displays columns:
TradeID

Action Type


Symbol


Exchange


Interval


Alert Time


Action


Price


Time Lapse (now() - alert_time, formatted)


P&L % (pnl_pct or live (currentPrice - price)/price*100)


Status (open/closed)


Screen Designs
The user interface
The entire page data can be filtered with a filter sections:
- Date and time filter 
- Symbol search textbox filter

At the top of the page are statistics displays showing:
- Number of Open trades
- Number of closed trades
- Number of Unique Symbols (Assets)
 
Next is a sortable table DataGrid that displays columns for the following field :TradeID , Symbol , Exchange , Interval , Alert Timestamp , Action , Price , Time Lapse  ,  % P&L  ,Status 
 
The design should also feature  a sidebar navigation for :
Home 
Open trades - This will filter the main page with data for open trades
Closed trades - This will filter the main page with data for open trades
Settings - This will display the webhook url and other configuration items

