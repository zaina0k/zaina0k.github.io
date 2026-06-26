---
title: "Let's Hack Leicester 2024"
summary: "A portfolio project collaboration platform for CS students, built as a team of 5 in 24 hours at the Let's Hack Leicester hackathon."
detail: "Led backend development and team coordination at Let's Hack Leicester 2024, building a Next.js + Flask + SQLite web app for students to find and join portfolio projects."
thumbnail: "../../assets/projects/lets-hack-leicester/lhl-image-1.png"
startDate: 2024-11-01
endDate: 2024-11-15
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
  - "Backend"
category: "hackathon"
teamSize: 5
role: "Team Lead & Backend Developer"
github: "https://github.com/zaina0k/lets-hack-leicester"
ogImage: "/og/lets-hack-leicester.png"
skills:
  - "Full-stack development"
  - "API design"
  - "Team leadership"
  - "Database design"
results:
  - "Did not place — our presentation ran over the time limit and we were unable to complete speaking about our concept."
  - "Two of five team members had difficulty contributing to the codebase, which significantly impacted how much we could complete within the time constraint."
  - "Technical difficulties with the Next.js frontend prevented the application from reaching a presentable state for judges — the site was not hosted for judging."
  - "The backend APIs were completed and integrated successfully; the bottleneck was the frontend presentation layer."
reflection: |
  The key lesson was time management under pressure. With 2 of 5 members unable to contribute effectively to the codebase, we should have reprioritised earlier — using a dummy backend and focusing all effort on a presentable frontend. A fully functional backend that cannot be seen is less valuable in a hackathon than a polished frontend backed by static data.

  Had we taken our team constraints into account from the start, we could have built a dummy backend and redirected effort toward the frontend. In future hackathons, a strong frontend with hardcoded data first — then hook up a real backend — would be the more pragmatic approach.

  Two planned features that were cut for time and would strengthen the platform significantly:

  Mentorship: pairing less experienced students with capable mentors through the CS society. Mentors would be community-recognised members with an incentive similar to committee membership — networking and community work to showcase to employers.

  Social media aspects: common social features to help users connect more easily. <add content here — original notes were incomplete>
groups:
  - "university"
  - "web"
  - "hackathon"
  - "python"
media:
  - type: image
    src: /projects/lets-hack-leicester/lhl-home-page.png
    alt: "Home page"
  - type: image
    src: /projects/lets-hack-leicester/lhl-image-1.png
    alt: "App screenshot"
  - type: image
    src: /projects/lets-hack-leicester/lhl-architecture-diagram.png
    alt: "Architecture diagram"
---

## Overview

As a team of 5, we created a web application that would allow students to find projects to work on for their portfolio. By creating a user system, we allowed users to both post their project ideas and join other people's projects, encouraging collaboration.

Portfolio projects are an important part of building an understanding of technologies, and also portray to employers a genuine interest in the subject. More high-level and specific projects can allow students to demonstrate this interest towards certain fields such as Data Science, Game Dev, and many others.

We were tasked with creating an application that would benefit people at the University of Leicester or the wider local community. Projects were judged by a panel from the Computer Science society and proxies from Capital One, based on:

- Solution Viability
- Technical Sophistication of Solution
- Group Cohesion and Overall Teamwork
- Presentation Quality

We felt our idea provided a solution to University of Leicester CS students who were looking to expand their portfolio but were unsure where to start, or nervous about working alone.

## Approach & Architecture

Given that we wanted to create a web application, we chose Next.js for the frontend and Python Flask for the backend. For the prototype, a simple database was necessary and we chose SQLite.

Next.js was chosen by the frontend team for quick setup and flexibility. Python Flask was chosen on the backend because the team was familiar with Python, and it integrated well with SQLite — a lightweight database suitable for prototyping.

![LHL Architecture Diagram](../../assets/projects/lets-hack-leicester/lhl-architecture-diagram.png)

The Flask API exposed endpoints covering project CRUD and join request handling. SQLite was chosen for portability — no database server to configure during a hackathon. The Next.js frontend consumed the API via `fetch`, with client-side state managed through React hooks.

## Development & Learning

As teams were randomly allocated, the first priority was understanding each member's strengths so we could optimise production and fairly split the work. I volunteered as team lead, setting up the Git repository via GitHub and communication channels via Discord.

My programming role was to work on the backend, but as team lead I also ensured all participants were aligned with the project idea and that individual technical difficulties were resolved quickly — including integrating code from all team members, which required comprehensive understanding of every part of the project.

To optimise our time, we split the group into a frontend sub-team and a backend sub-team. My contributions within the backend team:

- Designed the database schema with the required tables for user data and project listings
- Designed the APIs allowing the frontend to communicate with the database
- Implemented those APIs and integrated them into the Next.js frontend

![LHL Home Page Mockup](../../assets/projects/lets-hack-leicester/lhl-home-page.png)

*Mockup of the home page design*
