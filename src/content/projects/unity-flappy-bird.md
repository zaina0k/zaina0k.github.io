---
title: "Flappy Bird (Unity)"
summary: "A Unity remake of the classic Flappy Bird arcade game, built from scratch as a self-directed exercise in game development."
detail: "Rebuilt Flappy Bird from scratch in Unity — including custom Aseprite sprites, infinite pipe spawner, particle-based cloud system, and multi-screen UI."
thumbnail: "../../assets/projects/unity-flappy-bird/flappy-bird-gameplay.png"
startDate: 2024-07-01
endDate: 2024-07-15
status: shipped
sortOrder: 5
featured: false
techStack:
  - "Unity 2022.3.34f1"
  - "C#"
  - "Aseprite"
tags:
  - "Unity"
  - "Game Dev"
  - "Personal"
  - "C#"
category: "personal"
role: "Sole Developer"
ogImage: ""
skills:
  - "Unity game development"
  - "C# scripting"
  - "Sprite design"
  - "UI/Canvas"
results:
  - "Fully playable infinite Flappy Bird clone with randomised pipe gap heights and a working score system."
  - "Score tracking with local best-score persistence and a post-death scorecard showing score, best score, and leaderboard."
  - "Cloud system using a Unity particle effect with a custom particle sprite — clouds appear at random speeds and sizes."
  - "Three screens implemented: Home, Game Over, and Pause, all using Unity canvas UI."
  - "Pause/resume gameplay via escape key; restart and quit from the Game Over screen."
reflection: |
  Key Unity concepts covered in this project:

  Custom sprite design using Aseprite — creating and integrating original pixel art assets into Unity.

  Multiple screens and scenes — navigating between Home, Game and Game Over states cleanly.

  Manipulating game timer to implement the pause screen without breaking the game loop.

  Unity canvas UI — building overlay screens, buttons, and dynamic score display.

  Infinite spawners with randomised parameters — creating a procedural gameplay loop that never repeats.
groups:
  - "personal"
  - "game-dev"
  - "unity"
media:
  - type: youtube
    src: UhEKREfcWCc
    caption: "Gameplay video"
  - type: image
    src: /projects/unity-flappy-bird/flappy-bird-gameplay.png
    alt: "Gameplay screenshot"
  - type: image
    src: /projects/unity-flappy-bird/flappy-bird-title-screen.png
    alt: "Title screen"
---

## Overview

This project acted as an exercise to test my experience and knowledge of Unity by building a game from scratch. I chose to remake Flappy Bird — an old popular iPhone arcade game. The premise is simple: flap the bird's wings to get through as many pipes as possible.

## Approach & Architecture

The game is built in Unity 2022.3.34f1 with C# scripting.

**Gameplay mechanics:**
- Spacebar makes the bird flap its wings, counteracting gravity to move upward
- Pipe gaps are randomised in height, spawning infinitely to create the gameplay loop
- Points are awarded for every set of pipes the bird passes through
- The escape key pauses and resumes gameplay
- On death, a scorecard overlay shows the player's score, best score, and leaderboard, with options to restart or quit

The game is infinite with no win condition — the goal is simply to beat your own high score.

## Development & Learning

**Setup:** I started by collecting all sprites and assets I wanted to use throughout the project. This included creating some sprites from scratch in Aseprite, such as the clouds.

**Bird:** Created the bird sprite and worked on its movement by adjusting gravity and velocity values in the bird's C# script.

**Pipes:** Set up the pipe system in three parts:
- Colliders that trigger the death sequence on contact
- A gap trigger that detects the bird passing through and increments the score
- An infinite spawner with randomised height to create the continuous gameplay loop

**Background:** Created the cloud system using a Unity particle effect with a custom particle sprite, allowing clouds to appear at random speeds and sizes.

**Score:** Set up the gameplay scripts to record and save the player's score, including local best-score persistence across sessions.

**Screens:** Created the Home, Game Over, and Pause screens using Unity's canvas UI system.

---

## Miscellaneous / To Review

*Content below does not fit the five-section template — kept here for manual review.*

**What to add next:**
- Variable difficulty modes, or difficulty that increases over time as the player's score rises
- Multiple zones dependent on score — zones could change backgrounds and physics settings (e.g. different gravity)
- User login system with an online leaderboard
- Multiple bird skins / sprites that the user can choose before playing
