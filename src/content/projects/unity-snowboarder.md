---
title: "Snowboarder Game (Unity)"
summary: "A physics-based sidescrolling Unity game where the player controls a snowboarder through a level using rotation and speed boosts."
detail: "Built a physics-based sidescrolling snowboarder game in Unity — featuring sprite shape terrain, edge colliders, a Cinemachine follow camera, and particle effects."
thumbnail: "../../assets/projects/unity-snowboarder/snowboarder-1.png"
startDate: 2024-07-01
endDate: 2024-07-01
status: shipped
sortOrder: 6
featured: false
techStack:
  - "Unity 2022.3.34f1"
  - "C#"
  - "Cinemachine"
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
  - "Physics-based movement"
  - "Particle effects"
results:
  - "A complete, playable sidescrolling level with a working win and death sequence."
  - "Physics-based movement — the player controls the snowboarder by rotating in mid-air and boosting speed on the ground."
  - "Separate head collider that independently triggers the death sequence on impact."
  - "Particle effects for win state, death state, and snow contact."
  - "Cinemachine follow camera tracks the player smoothly through the level."
reflection: |
  Key Unity concepts covered in this project:

  Sprite shapes — creating organic terrain (snow slopes) using Unity's Sprite Shape tool rather than flat tile-based geometry.

  Edge colliders — applying physics boundaries to sprite shape terrain so the player character interacts naturally with the surface.

  Cinemachine follow camera — attaching a camera that tracks the player automatically through the level without manual scripting.

  Scene management — handling scene reloads on both the win and death events cleanly.

  Particle effects — creating contextual visual feedback for different game events (win, death, snow contact).

  Introduction to sound effects — hooking audio into game events for basic feedback.
groups:
  - "personal"
  - "game-dev"
  - "unity"
---

## Overview

This project continues my game development journey and showcases a moving physics-based sprite on a sidescrolling platform. The aim is to complete the level without dying — the death condition is the player sprite's head making contact with any surface. Rotation and speed boost controls allow the player to perform flips off the slopes.

> **📷 Carousel — 2 images ready:** `snowboarder-1.png`, `snowboarder-2.png`
> *(Carousel component not yet implemented — CP9)*

## Approach & Architecture

The game is built in Unity 2022.3.34f1 with C# scripting and Cinemachine for the camera.

**Gameplay mechanics:**
- The goal is to complete the sidescrolling level without dying
- There is currently no points system or way to compare progress between players
- Level completion is determined by passing the green flag at the end of the level
- The player controls the snowboarder by:
  - Rotating the sprite in mid-air
  - Boosting speed while on the ground
- Higher speeds before a ledge produce longer air time and more flips — flips could form the basis of a future scoring system (e.g. points per flip completed)

**Separate head collider:** The snowboarder has two colliders — a body collider for general physics interaction with terrain, and a dedicated head collider. Only the head collider triggers the death sequence, making it possible to graze surfaces with the body without dying.

## Development & Learning

This project was built following an online course that explained key Unity concepts and provided the base assets.

**Build order:**
1. Ground sprite and snow texture using Unity's Sprite Shape tool to create organic terrain
2. Player sprite with movement mechanics — adjusting physics values for rotation and boost; added the separate head collider for the death condition
3. Death sequence and win sequence — both cause the scene to reload, returning the player to the start of the level
4. Environment sprites added for visual depth
5. Particle effects for three states: win, death, and touching the snow surface
