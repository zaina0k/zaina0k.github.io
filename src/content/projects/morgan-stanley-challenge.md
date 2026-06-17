---
title: "Morgan Stanley Coding Challenge — Algorithmic Trading Bot"
summary: "EMA-based currency exchange trading strategy. Placed 7th out of 27 teams."
detail: "Built an EMA-based algorithmic trading strategy. Placed 7th out of 27 teams in a Morgan Stanley-hosted competition."
thumbnail: "../../assets/thumbnails/morgan-stanley-challenge.png"
startDate: 2024-03-01
endDate: 2024-03-01
status: shipped
sortOrder: 2
featured: true
techStack:
  - "Python"
  - "Pandas"
  - "NumPy"
  - "REST APIs"
  - "Git"
tags:
  - "Algorithms"
  - "Python"
  - "Competition"
category: "competition"
teamSize: 2
role: "Algorithm Developer"
github: "https://github.com/zainaltaf/morgan-stanley-challenge"
liveDemo: ""
ogImage: "/og/morgan-stanley-challenge.png"
skills:
  - "Algorithm design"
  - "Financial data analysis"
  - "Technical indicators"
  - "Competitive programming"
---

## The Problem

Morgan Stanley hosted a coding challenge open to university students across the UK. Teams were given access to a simulated currency exchange API and tasked with writing an automated trading bot that would maximise returns over a fixed trading window. The simulation ran in real time — your bot made live API calls, received price data, and had its trades recorded. Final ranking was by portfolio value at the close.

Twenty-seven teams competed. The constraint wasn't just algorithmic — it was operational. The API had rate limits, the simulation ran for a bounded period, and any bot that crashed or made invalid requests forfeited those trades.

## The Approach

We started by reading the API documentation carefully and sketching the decision loop before writing any code. The core loop was simple:

1. Fetch the current exchange rates
2. Evaluate whether to buy, sell, or hold based on the current signal
3. Submit the trade if the signal was strong enough
4. Wait, then repeat

The strategic question was which signal to use. We evaluated three approaches: simple moving average crossover, momentum-based, and exponential moving average (EMA). EMA weights recent prices more heavily than older ones, which suited the short simulation window — we didn't have weeks of history to smooth over.

We implemented a dual-EMA crossover: a short-window EMA (5 periods) crossing above a long-window EMA (20 periods) triggered a buy; the inverse triggered a sell. The window lengths were tuned by running the strategy against historical data provided in the documentation.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Trading Bot (Python)                                   │
│                                                         │
│  main loop                                              │
│  ├── fetch_rates()     ──►  Morgan Stanley API          │
│  ├── compute_ema()     ──►  Pandas rolling calc         │
│  ├── generate_signal() ──►  crossover logic             │
│  └── submit_trade()    ──►  Morgan Stanley API          │
│                                                         │
│  price_history: deque(maxlen=20)  ← rolling buffer      │
└─────────────────────────────────────────────────────────┘
```

A `collections.deque` with `maxlen=20` maintained the rolling price window without unbounded memory growth. The EMA was computed with Pandas on each tick. Error handling wrapped every API call — a failed request was logged and skipped rather than allowed to crash the loop.

## My Contribution

- Researched and selected the dual-EMA crossover strategy after comparing alternatives
- Implemented the signal generation and trade submission logic
- Wrote the error handling layer that kept the bot running through rate-limit responses
- Tuned the EMA window parameters against the sample historical data
- Tested the bot end-to-end against the simulation environment before the competition window opened

## Key Outcomes

- Placed 7th out of 27 competing teams
- Bot ran without crashes for the full duration of the simulation window
- Portfolio finished in positive territory across all three currency pairs traded

## What I Learned

The most valuable lesson was about the gap between a strategy that looks good in backtesting and one that holds up under operational constraints. Our EMA parameters were tuned on historical data — but the live simulation had different volatility characteristics. A more robust approach would have included parameter ranges and adaptive tuning rather than fixed windows.

The other lesson was defensive programming under uncertainty. Every external API call is a potential failure point. Writing the error handling before the strategy logic — rather than bolting it on at the end — made the bot substantially more stable under the live conditions.
