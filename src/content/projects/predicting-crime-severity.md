---
# Blueprint: docs/project-blueprints/predicting-crime-severity-blueprint.md

title: "CO3093: Predicting Crime Severity — Metropolitan Police Data Analysis"
summary: "ML pipeline on 1M+ Metropolitan Police records to predict monthly crime counts by area. Naive persistence baseline outperformed both trained regression models."
detail: "Built an end-to-end data science pipeline on 1.1M Metropolitan Police records — data cleaning, MapReduce aggregation, K-Means clustering, and regression modelling — as sole developer for a Big Data coursework assessment."
sortOrder: 3
featured: false
startDate: 2026-01-26
endDate: 2026-03-27
status: shipped
media:
  - type: image
    src: /images/ui/project-page-in-progress-thumbnail.png
    alt: Project page in progress — screenshots coming soon
    caption: Media coming soon
techStack:
  - "Python"
  - "pandas"
  - "scikit-learn"
  - "matplotlib"
  - "seaborn"
  - "Jupyter Notebook"
tags:
  - "Sole Developer"
  - "Data Science"
  - "Python"
  - "Academic"
category: personal
role: "Sole Developer & Analyst"
# ogImage not yet generated — generate at /og/predicting-crime-severity.png when ready
skills:
  - "Large-scale data cleaning and feature engineering"
  - "Supervised regression modelling and evaluation"
  - "Time-series cross-validation design"
  - "Unsupervised clustering"
  - "Technical report writing"
results:
  - "Dataset cleaned from 1,135,031 rows to 1,037,387 (8.6% removed), with zero remaining missing LSOAs and zero duplicate Crime IDs."
  - "MapReduce aggregation produced 58,353 LSOA–month records; verified sum matches the cleaned incident count exactly."
  - "K-Means: k=7 selected; silhouette score peaked at k=7 on a 50,000-row diagnostic sample; spatial scatter confirmed geographically coherent cluster boundaries."
  - "Naive lag-1 baseline: RMSE 10.39, R² 0.94 — outperformed both trained models on the chronological holdout (Oct–Dec 2023)."
  - "Linear Regression: RMSE 11.27, R² 0.93. Random Forest Regression: RMSE 14.56, R² 0.88."
  - "Lag-1 Pearson correlation with current crime count: r = 0.961."
  - "Single three-month holdout window is a thin basis for definitive conclusions; temporal cross-validation on the training window (Mean RMSE 9.56 for LR, 9.74 for RF across 4 folds) partially addresses this."
reflection: |
  The biggest learning was about when not to reach for a more complex model. Before running the evaluation, I expected Random Forest to outperform Linear Regression, which would outperform the naive baseline. The actual order — naive beats linear beats forest — was a genuine surprise. When a single feature explains 96% of the variance in the target, a flexible model has nothing useful to learn. The lag signal was so dominant that the Random Forest was effectively trying to improve on a near-perfect predictor using three weak auxiliary features, and ended up fragmenting a smooth relationship into noisy piecewise rules. The lesson is concrete: always run the simplest possible baseline before committing to more complex approaches.

  The second major learning was about temporal structure in evaluation design. A random 80/20 split on a time series mixes future observations into the training set — it reports inflated performance because the model is partly tested on its own context. Chronological splitting is the only valid design for forecasting tasks, even when it produces fewer test observations. I knew this in principle; working through the consequences on a real dataset made it concrete.

  On process: writing the report alongside the analysis, rather than after it, kept the narrative coherent. Each EDA section was written while the results were fresh, which meant figures were interpreted in context rather than retrofitted to conclusions decided after modelling. Working to a hard 10-page limit was useful discipline — every figure had to earn its place by contributing to an argument, not just demonstrating that a plot was produced.

  In retrospect, I would one-hot encode the district_cluster label from the start rather than storing it as an integer. The marginal effort is minimal and it removes the spurious ordinality problem entirely. I would also treat temporal cross-validation as the primary evaluation method rather than a secondary robustness check — three months from a single chronological holdout is a thin basis for confident conclusions. For clustering diagnostics, a single full-data fit would be cleaner than the two-step approach of subsample diagnostic followed by a separate full-data refit, which could in principle return different optimal k values.
groups:
  - "university"
  - "python"
  - "algorithms"
---

## Overview

UK police forces face the challenge of geographically uneven crime distribution — some neighbourhoods record sustained high volumes while others remain consistently quiet. Without quantitative prediction, patrol resource allocation relies on lag-heavy bureaucratic processes rather than forward-looking evidence. This project builds a supervised regression pipeline that forecasts how many crimes will be recorded in each LSOA (Lower Super Output Area) in the following calendar month, providing a data-driven input for resource planning decisions.

The project was mandatory assessed coursework for CO3093 Big Data and Predictive Analytics at the University of Leicester, worth 70% of the module grade. The dataset — 1.1M Metropolitan Police incident records from 2023 — and the high-level task structure (data preparation, regression modelling, clustering, MapReduce, written report) were specified by the module. The specific approach to feature engineering, model selection, evaluation design, and analytical framing was entirely my own work.

The intended audience is technically literate non-specialists: police analysts or policymakers who want to understand crime prediction at neighbourhood level. The report was written to be accessible to this audience rather than only to module assessors.

## Approach & Architecture

The foundational design decision was the analytical unit. Rather than modelling individual incidents (1.1M rows, and not the right prediction target), I first reduced the dataset to 58,353 LSOA–month rows by counting incidents per area per month using a plain Python MapReduce implementation. This `crime_count` aggregate became the regression target and the unit of all subsequent analysis.

**Chronological train–test split.** Data was split with Feb–Sep 2023 for training and Oct–Dec 2023 as the holdout. A random split was explicitly rejected — it would mix adjacent months of the same LSOA across train and test, creating data leakage and producing over-optimistic metrics that do not reflect real predictive performance. Chronological splitting is the only valid design for a forecasting task.

**Lag and rolling features as primary predictors.** EDA revealed a Pearson correlation of r = 0.961 between last month's crime count and the current month's count for the same LSOA. This persistence signal made `lag_1_crime_count` the most predictive feature by a wide margin. `rolling_mean_3` (trailing three-month average) added marginal noise smoothing, and `month_num` captured a weak seasonal signal.

**K-Means clustering as a regression feature.** Rather than treating the clustering requirement as a disconnected analysis, I fed the resulting `district_cluster` label (k=7, selected via elbow and silhouette diagnostics on a 50,000-row subsample) into the regression models as a spatial context feature. This integration gave the clustering work architectural purpose and connected it to the modelling section of the report. DBSCAN was not explored; K-Means was appropriate for the roughly convex geography of London at this scale.

**A naive persistence baseline as benchmark.** A model that cannot outperform "just use last month's value" has not demonstrated genuine learning. Including the naive lag-1 baseline was a deliberate guard against overconfidence — and it turned out to be the most important decision in the evaluation design.

## Development & Learning

Data cleaning removed 97,644 rows (~8.6%) from the raw 1,135,031 incidents. The first significant problem was missing LSOA codes (2.08% of records). I initially attempted to impute these from ONS geographic lookup tables using available coordinates, but every row with a missing LSOA also lacked usable coordinate data, making geographic imputation infeasible. Those rows were dropped. Additional cleaning removed location outliers (39,827 rows outside 1.5×IQR on longitude/latitude) and deduplicated Crime IDs (36,551 removed). After cleaning, zero missing LSOAs and zero duplicate IDs remained.

The MapReduce aggregation was implemented in plain Python using `map()` and `functools.reduce`. Map emitted `(LSOA, Month) → 1` pairs; shuffle grouped by key; reduce summed to produce the 58,353 LSOA–month rows. The sum was verified to equal the cleaned incident count exactly, confirming no data was lost or double-counted.

The most unexpected finding was the result order: the naive baseline (RMSE 10.39) outperformed Linear Regression (RMSE 11.27), which outperformed Random Forest (RMSE 14.56). I initially treated the Random Forest's underperformance as a possible bug. Investigating confirmed it was a genuine result: in a four-feature persistence-dominated problem, the forest fragmented a smooth lag relationship into piecewise rules and produced larger errors in the high-count tail where RMSE costs are highest. I reported this as a substantive analytical finding rather than a tuning failure — a model that isn't better than "use last month's value" has not demonstrated learning on this problem formulation.

A second acknowledged limitation: the `district_cluster` label was encoded as an integer (0–6), which implies an ordinal relationship between clusters that doesn't exist. One-hot encoding was the correct approach; keeping it as an integer was accepted as a lightweight tradeoff given the feature's small marginal contribution to model performance, and was noted explicitly as technical debt in the report.
