---
layout: posts
title: "Morgan Stanley Coding Challenge"
permalink: /projects/MSCodingChallenge2024/
date: 2024-10-23
---

<img src="/assets/images/MS image 4.jpeg" alt="MS Image 4" style="width:100%; height:auto;">

## Overview
Participating in the Morgan Stanley coding challange, our task revolved around financial markets - in this case currency exchange between GBP and EUR. The EUR/GBP trading pair is a quotation on the current value of the Euro against the Pound. 

## Problem Statement
In this challenge we were grouped into teams of 5 and tasked with building and implementing a trading strategy on a currency exchange market. This meant we were given £1,000,000 in start up capital and based on market predictions we were to move our assets for the highest return while minimising losses. 

## Trading Strategy
#### EMA:
As this was an introductory project into financial trading bots, our team decided on the EMA trading strategy. EMA is a moving average that assigns greater weight to the most recent price data. By using a short term EMA (5 periods) and long term (20 periods). Crossing of these EMA graphs would trigger a trade signal within the program to buy or sell. 

#### Risk and Reward Management
The bot incorporates a risk management system by adjusting te trade sized based on a fixed risk percentage and a reward ratio of 2:1. This meant that our take profit was set at twice the distance of the stop-loss.

## Team Role and Contribution
Given that the teams were randomly assigned it was important to assess the strengths within the team to better distribute the workload between the team. We ended up with a 3-2 split with 3 people working on developing the trading strategy and 2 people working on the API calls for GETting current market data from the simulations as well as POSTing a buy or sell based on the strategy. 

My role was programming the trading strategy based on research into the EMA strategy by one of my sub-team members. This required me to accurately interpret the workings of the trading strategy into the code and creating signals for when the API should buy or sell based on the previous data. 

## Results and Performance
In the end our team placed 7th out of 27 teams. While we were happy with the results a few key points would have allowed us to perform better. 

1. Part of the EMA strategy was describing the short and long term periods in which the averages are taken. Given that a data point was captured each second 5 and 20 periods may have been to short of a time to take averages. This may have caused a high frequency of trades which may have lead to excessive trading and losses during volatile periods.
2. Part of the simulation was hindsight on certain major market fluctuations. During our time coding the project we did not spend time optimising the code to anticipate this which caused us to not gain as much as was possible
3. There are other filters that must be applied in conjunction with EMA to allow for its full effectiveness. 

As a team we were able to achieve a fair amount in the short period of time we had to develop the program. With more testing time and refinement the trading bot could have made more money. For now it stands as a foundational program into market trading. 

<div style="text-align: center;">
    <img src="/assets/images/MS image 1.jpg" alt="MS Image 1" style="width:50%; height:auto;">
</div>

## Team Participants:
- [Raul Blanco Vazquez](https://www.linkedin.com/in/raulblancovazquez/)
- [Zara Hussain](https://www.linkedin.com/in/zarahussain25/)
- [Zeeshan Masood](https://www.linkedin.com/in/zeeshan-masood/)