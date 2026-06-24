---
# Before filling this in, complete the project blueprint document for this project.
# Blueprint location: docs/project-blueprints/dissertation-project-blueprint.md
# Every field below maps to a section in that blueprint — the blueprint's completion
# checklist confirms you have everything needed before opening this file.

title: "Carbon-Aware Workload Scheduling Simulator"
summary: "Discrete-event simulator evaluating four carbon-aware cloud scheduling policies on real GB grid data, producing a 60-run recommendation matrix."
detail: "Designed and built a Python discrete-event simulation framework from scratch — ingesting GB carbon-intensity traces and HPC workload logs, implementing four scheduling policies behind a plugin interface, and producing a colour-coded recommendation matrix across 60 experimental runs. Sole developer on a CO3201 final-year dissertation project."
startDate: 2024-10-01
endDate: 2026-04-27
status: shipped
sortOrder: 1
featured: true
media:
  - type: image
    src: /images/ui/project-page-in-progress-thumbnail.png
    alt: Project page in progress — screenshots coming soon
    caption: Media coming soon
techStack:
  - "Python"
  - "NumPy"
  - "pytest"
  - "YAML"
  - "Abstract Base Classes"
tags:
  - "Sole Developer"
  - "Python"
  - "Dissertation"
  - "Simulation"
category: "personal"
role: "Sole Developer"
ogImage: "/og/carbon-aware-scheduling-simulator.png"
skills:
  - "Modular system architecture"
  - "Reproducibility engineering"
  - "Experimental design and evaluation"
  - "Scientific root-cause debugging"
  - "Research-grade software development"
results:
  - "7 of 8 project objectives fully achieved; 1 partially achieved (deliberate scope decision)."
  - "665 tests pass across 18 test files (unit, integration, and golden-trace regression)."
  - "60 simulation runs completed: 3 workload profiles × 5 seasonal windows × 4 policies."
  - "WindowOptimal achieves 27.0% carbon reduction on canonical configuration (92,128 → 67,276 kgCO₂e)."
  - "WindowOptimal recommended in 14 of 15 matrix cells; mean savings range 6.7%–24.5% across seasons."
  - "ThresholdDeferral achieves 10.1% carbon savings at only 1.4h mean delay — a tunable Pareto point between baseline and full optimal."
  - "LowestSlot achieves 11.3% savings at 8.8h mean delay."
  - "Three-tier capacity pool (reserved/spot/on-demand) is implemented and tested; capacity-aware matrix sweep is deferred as future work."
  - "Results assume perfect carbon foresight (actual historical intensity) — real-world savings would be lower depending on forecast accuracy."
  - "Embodied carbon (~31% of lifecycle footprint) is excluded; relative delta comparisons in the matrix remain valid."
  - "Single workload trace (RICC-2010-2, 2010) — results may not generalise to modern bursty or serverless workloads."
reflection: |
  The most important technical lesson was that reproducibility requires ordering every collection the seeded code iterates over, not just seeding the RNG. The Python set ordering bug was invisible to unit tests and golden-trace regression tests on synthetic data — it only surfaced when running the real RICC trace. I would not have caught it without both an automated determinism test suite and real-data runs. Automated coverage does not substitute for running the actual system on real inputs.

  Defining frozen dataclasses for `Task` and `CarbonTrace` before writing any policy logic paid off immediately — the policy interface came out clean and I avoided two rounds of refactoring. Similarly, introducing the `CarbonWindow` intermediate object before implementing any policy (rather than retrofitting it onto two already-complete policies) would have saved re-testing time. The lesson I keep arriving at: establish data contracts first.

  NumPy vectorisation should have been introduced at the data ingestion layer from the start, not as a profiling-driven optimisation mid-project. The speed difference only became visible on the full RICC trace, but the change was structural — adding it early would have removed a profiling pass and a partial rewrite.

  The YAML-driven experiment runner was consistently underestimated in planning time. Configuration infrastructure is not glamorous, but making it robust — handling partial failures gracefully, preventing silent parameter mismatches, enabling reproducible reruns — is real engineering work. I would plan for it explicitly from the start.

  Writing the dissertation shaped the project scope more than any planning document did. The decision to hold instance mix and deferral windows constant in the headline matrix — producing a clean three-axis (workload × season × policy) result rather than an uninterpretable five-axis one — only became clear through writing. I would treat writing as a design tool, not a deliverable to produce at the end.

  If I were starting again: use multiple workload traces from the start (Alibaba-PAI or Azure-VM alongside RICC) for more generalisable conclusions; introduce the YAML experiment runner earlier; and design the capacity-aware matrix sweep as part of the core experimental plan rather than deferring it. The capacity layer was built and tested — extending the runner to sweep it would have been straightforward, and the findings would have been richer.
groups:
  - "university"
  - "python"
  - "algorithms"
---

## Overview

Cloud computing's carbon footprint grows as demand for compute scales. The UK has committed to net-zero greenhouse-gas emissions by 2050 — a target that puts pressure on every energy-consuming sector, datacentres included. One practical mechanism for reducing cloud carbon emissions is *carbon-aware temporal workload shifting*: delaying batch jobs to run during lower-carbon-intensity periods on the electricity grid. Several scheduling policies for this approach exist in research literature, ranging from simple lowest-slot selection to threshold-based deferral and window-optimal search. The problem is that no systematic basis for choosing among them existed — a cloud engineer had no evidence-based starting point for picking the right policy given their workload composition, season, or grid context.

This project built a discrete-event simulation framework that ingests real GB carbon-intensity traces (NESO 5-minute resolution data) and HPC workload logs (RICC-2010-2 Parallel Workloads Archive), models four scheduling policies under a common interface, and produces a recommendation matrix mapping each (workload profile × seasonal carbon-trace window × policy) combination to the policy that achieves the lowest operational carbon emissions in simulation.

The work sits at the intersection of cloud systems and practical sustainability. The research gap — the absence of a systematic multi-dimensional policy comparison — was identified by surveying the literature: GAIA's three-way cost/carbon/performance treatment stood in contrast with the narrower per-policy analyses in other works. Building a simulator rather than an empirical study was motivated by the need for controlled, reproducible, variable comparisons — running a real HPC workload against five seasonal carbon traces and four policies simultaneously is not feasible without simulation.

The primary audience is cloud engineers scheduling deferrable batch workloads on the GB grid who want evidence-based guidance on which temporal shifting policy suits their specific operational context. The secondary audience is researchers who may extend the simulator — hence the modular, plugin-extensible architecture.

## Approach & Architecture

The simulator uses a tick-based discrete-event model: 1 tick = 5 seconds, 60 ticks per 5-minute carbon intensity interval. This resolution was chosen so that every carbon-trace observation maps exactly to 60 ticks with no fractional remainder, preserving the integral invariant — splitting hourly intensity by 720 ticks-per-hour gives the same total carbon cost when summed, which ensures accurate mid-interval task tracking. Continuous-time simulation was considered but rejected because event queues and floating-point time arithmetic would have complicated both determinism and cross-experiment comparison.

**Seven principal components** make up the modular pipeline: Carbon Data Module, Workload Model, Simulation Engine, Policy layer, Accounting Engine, Metrics & Evaluation Engine, and Visualisation Layer. Each assumes a single responsibility and communicates through typed data contracts — immutable frozen dataclasses for `Task` and `CarbonTrace`. This means the simulation core is identical across all experiments; only the policy and configuration change, ensuring valid comparisons.

**Policy extensibility** is handled by a plugin registry. A string key in `POLICY_REGISTRY` bridges the YAML config to policy classes; all four policies implement a single abstract interface (`schedule(task, current_tick, trace) → ScheduleDecision`) enforced by Python ABCs. Adding a new policy requires implementing one abstract class and adding one registry entry — no core simulation file is touched. The four policies span a range of lookahead strategies: `Immediate` (no deferral), `LowestSlot` (lowest-intensity slot within a waiting window), `ThresholdDeferral` (defer until intensity drops below a threshold), and `WindowOptimal` (minimum carbon integral over the window).

**CarbonWindow** is an intermediate object that wraps the relevant trace slice for each policy call, returns a fallback intensity for out-of-range ticks, and centralises boundary logic. This decouples policies from trace length and was motivated by the observation that `Immediate` needs no trace view, `ThresholdDeferral` needs only the current tick's value, and `WindowOptimal` needs a slice of width `waiting_window + task_duration` — a single interface that passes the full trace would have forced each policy to handle its own boundary arithmetic.

**Experiment runner** is YAML-driven, generating every Cartesian permutation from a single config file. The headline matrix covers 60 runs (3 workload profiles × 5 seasonal windows × 4 policies). Each run writes output independently, so partial failures do not require re-running completed cells. A two-path simulation dispatch distinguishes unlimited capacity (the headline matrix) from a constrained three-tier `CapacityPool` with real CPU budgets and spot-first allocation — the capacity layer is implemented and tested but the constrained matrix sweep is identified as future work.

NumPy arrays are used for carbon trace storage (over Python lists) after profiling revealed per-tick Python loops in `total_carbon()` were the dominant runtime cost on the full RICC trace. Determinism is enforced by seeding each task's RNG independently using a Knuth-hash of the global seed and the task ID, making spot-preemption outcomes deterministic per task regardless of execution order.

## Development & Learning

Seven of eight project objectives were fully achieved across two semesters: Semester 1 for architecture and core engine, Semester 2 for experiments, evaluation, and dissertation. The simulator ingests NESO GB carbon-intensity traces and the RICC-2010-2 HPC workload trace, implements all four scheduling policies, models three instance types with stochastic spot preemption, enforces deterministic reproducibility, and produces a colour-coded recommendation matrix heatmap. 665 tests pass across 18 test files at project completion.

**Non-deterministic output with identical seeds** was the most consequential technical problem encountered. The simulator produced different output values on different runs despite an identical seed — unit tests and golden-trace regression tests all passed. Tracing through three call-stack layers revealed the cause: Python's `dict` and `set` iteration order is non-deterministic. The fix was to replace all set-based collections in the hot path with sorted lists. Determinism was then confirmed by `test_determinism.py` — running the same seed twice produces byte-identical output. The lesson: reproducibility requires ordering every collection the seeded code iterates over, not just seeding the RNG. This bug would have been invisible without both a dedicated determinism test suite and real-data runs; synthetic golden traces passed throughout.

**ThresholdDeferral returning 0% savings in all 15 matrix cells** was a subtler problem that surfaced only during the Wave 5 matrix sweep, with no errors or test failures. The policy was comparing hourly-scale threshold values (kgCO₂/kWh) against per-tick intensity values (1/720th of hourly scale), making the threshold effectively infinite — every tick was below it, so the policy always scheduled immediately. The fix was applied at the policy level by scaling the comparison correctly, and a regression test was added using a carbon trace whose tick scale and hourly scale differ in known ways. After the fix, ThresholdDeferral correctly produces a 10.1% saving at 1.4h mean delay on the canonical week-27 configuration.

**Designing a unified policy interface** for policies with fundamentally different lookahead requirements was the third significant challenge. The resolution — the `CarbonWindow` intermediate object — was confirmed correct when ThresholdDeferral was added as a fourth policy without requiring changes to any of the existing three. In retrospect, this intermediate object should have been designed before implementing any policy; retrofitting it onto `LowestSlot` and `Immediate` after the fact required re-testing both.

The central finding of the 60-run sweep is counter-intuitive: *seasonal carbon-trace shape* matters more than workload type in determining which policy wins. WindowOptimal is recommended in 14 of 15 matrix cells, with mean savings ranging 6.7%–24.5% across seasons. ThresholdDeferral's 10.1% savings at only 1.4h mean delay — versus WindowOptimal's 27.0% at 9.9h — demonstrates a tunable Pareto point that may be more practical for latency-sensitive workloads. The threshold sensitivity sweep reveals a monotonic carbon/delay trade-off with a notable discontinuity at 0.100 kgCO₂/kWh, corresponding to business-hours task clustering in the real workload trace.
