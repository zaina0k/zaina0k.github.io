---
title: "Let's Hack Leicester — Collaborative Project Platform"
summary: "Full-stack web app for university students to find and join portfolio projects."
detail: "Led a team of 5 to build a full-stack web app in 24 hours. Next.js frontend, Flask API, SQLite database."
thumbnail: "../../assets/thumbnails/lets-hack-leicester.png"
startDate: 2024-11-01
endDate: 2024-11-01
status: shipped
sortOrder: 1
featured: true
techStack:
  - "Next.js"
  - "Python"
  - "Flask"
  - "SQLite"
  - "REST APIs"
  - "Git"
tags:
  - "Team Lead"
  - "Full-stack"
  - "Hackathon"
category: "hackathon"
teamSize: 5
role: "Team Lead & Backend Developer"
github: "https://github.com/zainaltaf/lets-hack-leicester"
liveDemo: ""
ogImage: "/og/lets-hack-leicester.png"
skills:
  - "Full-stack development"
  - "API design"
  - "Team leadership"
  - "Database design"
---

## The Problem

University students building portfolio projects often struggle to find collaborators with complementary skills. Solo projects limit scope; finding teammates happens through word-of-mouth or chance. There was no dedicated platform for CS students at the University of Leicester to advertise projects, signal availability, or form teams deliberately.

Let's Hack Leicester was a 24-hour hackathon sponsored by Capital One. The brief was open: build something that benefits the university student community. We identified the team-formation problem as high-impact and underserved, and spent the first hour aligning on scope before writing a line of code.

## The Approach

Given 24 hours, scope discipline was everything. We defined a minimal viable feature set in the first 30 minutes:

- Students can post a project with a title, description, and required skills
- Students can browse open projects and request to join
- Project owners can accept or decline requests

Everything else — messaging, profiles, recommendations — was explicitly deferred. This kept the backend API surface small and the frontend navigable within the time constraint.

I took ownership of the backend and the team coordination. We split into two pairs: one on the Next.js frontend, one on the Flask API and database, with me bridging both.

## Architecture

```
┌─────────────────────────┐      REST API       ┌─────────────────────────┐
│   Next.js Frontend      │ ──────────────────► │   Flask Backend         │
│   (React + Tailwind)    │ ◄────────────────── │   Python 3.11           │
└─────────────────────────┘    JSON responses    └──────────┬──────────────┘
                                                            │
                                                            ▼
                                                 ┌──────────────────────┐
                                                 │   SQLite Database    │
                                                 │   (users, projects,  │
                                                 │    join requests)    │
                                                 └──────────────────────┘
```

The Flask API exposed five endpoints covering project CRUD and join request handling. SQLite was chosen for portability — no database server to configure during a hackathon. The Next.js frontend consumed the API via `fetch`, with client-side state managed through React hooks.

## My Contribution

- Designed the database schema (three tables: users, projects, join_requests) and set up SQLite with SQLAlchemy ORM
- Built all five Flask API endpoints with input validation and appropriate HTTP status codes
- Wrote the API integration layer on the Next.js side — the `fetch` wrappers that the frontend team used
- Coordinated stand-ups every two hours to surface blockers before they became blockers
- Resolved a CORS misconfiguration thirty minutes before the presentation deadline

## Key Outcomes

- Delivered a working, demonstrable application within the 24-hour window
- Successfully presented to a panel of Capital One engineers and university staff
- The project formation and join-request flow worked end-to-end in the live demo
- Team cohesion held throughout — no merge conflicts lost to poor coordination

## What I Learned

The biggest lesson was how much team coordination compounds under time pressure. When I didn't check in with the frontend pair for three hours, they built a component that expected a different API response shape than what I'd implemented. Catching that mismatch cost us 90 minutes. After that, I added a shared `api-contract.md` to the repo — a plain-text list of endpoint shapes — and we kept it updated in real time. It solved the problem completely.

Technically: SQLite is fine for a prototype, but I'd use PostgreSQL the moment persistence and concurrent writes matter. The ORM abstraction (SQLAlchemy) made the eventual-migration path clear.
