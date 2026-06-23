---
title: "Morgan Stanley Coding Challenge 2024"
summary: "EMA-based algorithmic currency trading bot. Placed 7th out of 27 teams in a Morgan Stanley-hosted competition."
detail: "Built an EMA-based algorithmic trading strategy as part of a team of 5 in a Morgan Stanley-hosted coding challenge, placing 7th out of 27 teams."
thumbnail: "../../assets/projects/morgan-stanley-challenge/ms-image-4.jpeg"
startDate: 2024-10-01
endDate: 2024-10-01
status: shipped
sortOrder: 2
featured: true
techStack:
  - "Python"
  - "REST APIs"
  - "Git"
tags:
  - "Algorithms"
  - "Python"
  - "Competition"
category: "competition"
teamSize: 5
role: "Algorithm Developer"
github: "https://github.com/zaina0k/Morgan-Stanley-Coding-Challenge"
ogImage: "/og/morgan-stanley-challenge.png"
skills:
  - "Algorithm design"
  - "Financial data analysis"
  - "Technical indicators"
  - "Competitive programming"
results:
  - "Placed 7th out of 27 competing teams."
  - "The EMA parameters (5 and 20 periods) may have been too short, causing high-frequency trades and excessive losses during volatile periods."
  - "The simulation included hindsight on certain major market fluctuations which we did not optimise for, limiting potential gains."
  - "Additional filters used alongside EMA in professional settings were not implemented, which limited the strategy's full effectiveness."
  - "As a team we achieved a fair amount in a short time — with more testing and refinement the bot could have performed significantly better."
reflection: |
  The project stands as a foundational introduction to algorithmic market trading. The core EMA strategy worked and the bot ran reliably throughout the simulation, but there are clear areas where more refinement would have improved the result.

  The most significant lesson was around parameter tuning: a data point captured each second meant 5 and 20 periods represented a very short time window, likely causing excessive trades. Longer periods or adaptive tuning based on live volatility would have been more robust.

  <add content here — any personal reflections on what you learned beyond the technical points>
---

## Overview

Participating in the Morgan Stanley Coding Challenge, our task revolved around financial markets — specifically currency exchange between GBP and EUR. The EUR/GBP trading pair is a quotation on the current value of the Euro against the Pound.

We were grouped into teams of 5 and given £1,000,000 in startup capital. Based on market predictions, we were to move our assets for the highest return while minimising losses, with final ranking determined by portfolio value at the close of the simulation.

> **📷 Carousel — 4 images ready:** `ms-image-1.jpg`, `ms-image-2.jpg`, `ms-image-3.jpg`, `ms-image-4.jpeg`
> *(Carousel component not yet implemented — CP9)*

## Approach & Architecture

As this was an introductory project into financial trading bots, our team decided on the EMA (Exponential Moving Average) trading strategy. EMA assigns greater weight to the most recent price data, making it more responsive to recent market moves than a simple moving average.

By using a short-term EMA (5 periods) and a long-term EMA (20 periods), the crossing of these two graphs triggered a trade signal within the program to buy or sell.

**Risk and Reward Management**

The bot incorporated a risk management system by adjusting trade size based on a fixed risk percentage and a reward ratio of 2:1. This meant that our take profit was set at twice the distance of the stop-loss.

## Development & Learning

Given that teams were randomly assigned, it was important to first assess each member's strengths to better distribute the workload. We ended up with a 3-2 split:

- 3 members working on developing the trading strategy
- 2 members working on API calls — GETting current market data from the simulation, and POSTing buy/sell orders based on the strategy output

My role was programming the trading strategy based on research into the EMA approach conducted by one of my sub-team members. This required accurately interpreting the workings of the strategy into code and creating signals for when the API should buy or sell based on previous price data.
