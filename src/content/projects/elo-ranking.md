---
title: "Elo Ranking System — Competitive Rating Engine"
summary: "Full-stack application implementing the Elo rating algorithm with match history and an interactive desktop interface."
detail: "Full-stack application implementing the Elo rating algorithm with a REST API backend and interactive frontend."
thumbnail: "../../assets/thumbnails/elo-ranking.png"
date: 2023-11-10
startDate: 2023-10-01
endDate: 2023-11-01
status: shipped
sortOrder: 4
featured: true
techStack:
  - "Python"
  - "Flask"
  - "SQLite"
  - "tkinter"
  - "REST APIs"
tags:
  - "Full-stack"
  - "Algorithms"
  - "REST API"
category: "personal"
role: "Sole Developer"
github: "https://github.com/zainaltaf/elo-ranking"
liveDemo: ""
ogImage: "/og/elo-ranking.png"
skills:
  - "Algorithm implementation"
  - "API design"
  - "Database design"
  - "Desktop GUI development"
---

## The Problem

Elo is the rating algorithm used in chess, competitive gaming, and sports rankings worldwide. The core idea is elegant: after each match, points transfer from the loser to the winner, with the amount determined by the expected outcome — an upset against a higher-rated opponent earns more points than beating a lower-rated one.

I wanted to implement Elo from scratch to understand it properly, and to build something genuinely useful: a general-purpose ranking tool for any head-to-head competition — board games, table tennis, coding challenge leaderboards — where you want fair, adaptive rankings that update in real time.

## The Approach

The implementation has two layers: the algorithm and the application.

**The algorithm** was implemented from first principles, translating the mathematical formula directly into Python before wiring it into any framework:

```
Expected score:  E_A = 1 / (1 + 10^((R_B - R_A) / 400))
Rating update:   R_A' = R_A + K × (S_A - E_A)
```

Where `K` is a constant controlling rating volatility (higher K = faster adaptation; lower K = more stable ratings). I implemented a variable K-factor: new players start with K=40 for faster calibration, stabilising to K=20 after 30 matches.

**The application** separates concerns cleanly: a Flask REST API handles all data and business logic; a tkinter GUI consumes it. This separation meant I could swap the GUI for a web frontend without touching the rating engine.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  tkinter Desktop GUI                                    │
│  ├── Player registration screen                         │
│  ├── Match entry screen (select two players → submit)   │
│  ├── Leaderboard view (sorted by current rating)        │
│  └── Match history view (per-player)                    │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP (REST)
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Flask REST API                                         │
│  POST /players          ← register player               │
│  GET  /players          ← list with current ratings     │
│  POST /matches          ← record result, update ratings │
│  GET  /players/{id}/history  ← match history            │
└──────────────────┬──────────────────────────────────────┘
                   │ SQLAlchemy ORM
                   ▼
┌─────────────────────────────────────────────────────────┐
│  SQLite Database                                        │
│  players(id, name, rating, matches_played)              │
│  matches(id, player_a, player_b, winner, timestamp,     │
│           delta_a, delta_b)                             │
└─────────────────────────────────────────────────────────┘
```

Storing `delta_a` and `delta_b` (the rating change per match) made the match history view meaningful — you can see not just who won each match but how significant each result was.

## My Contribution

- Implemented the Elo algorithm with variable K-factor from the mathematical formula, not from a library
- Designed the database schema to make match history queryable without recomputing ratings
- Built the Flask REST API with four endpoints and input validation
- Built the tkinter GUI, including the real-time leaderboard that refreshes after every match entry
- Tested the rating update logic against known Elo calculations to verify correctness

## Key Outcomes

- The rating engine correctly handles all edge cases: draws, new players with no history, and large upsets
- The variable K-factor calibration meaningfully reduced rating volatility for established players
- The REST API / GUI separation proved its value when I added the match history view — zero changes to the API, new screen in the GUI only

## What I Learned

Implementing a well-known algorithm from scratch, rather than using a library, forces you to understand it rather than just use it. I found two subtleties in the standard Elo formula that aren't obvious until you implement them: the 400-point divisor is a convention (not a mathematical necessity) that determines how quickly expected score changes with rating difference, and the K-factor trade-off between responsiveness and stability is a design choice, not a right answer.

The architectural lesson: separating the Flask API from the GUI meant every feature addition was a clean decision — does this logic belong in the API or the display layer? Having that boundary made the codebase easier to reason about and extend.
