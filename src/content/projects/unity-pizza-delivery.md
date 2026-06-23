---
title: "Pizza Delivery Game (Unity)"
summary: "A top-down car game built in Unity as a Udemy tutorial project — my first complete game, covering core Unity scripting and physics concepts."
detail: "Built a top-down pizza delivery car game in Unity following a Udemy course, learning core engine concepts including colliders, triggers, components, and C# scripting."
thumbnail: "../../assets/projects/unity-pizza-delivery/pizza-delivery-1.png"
startDate: 2024-07-01
endDate: 2024-07-01
status: shipped
sortOrder: 7
featured: false
techStack:
  - "Unity 2022.3.34f1"
  - "C#"
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
  - "Colliders and triggers"
  - "Component referencing"
results:
  - "A complete, playable top-down car game with pickup and delivery mechanics."
  - "Three pizza boxes to collect and deliver — completing all three ends the game."
  - "Working speed modifiers: orange speed bumps slow the car; green triangles boost it."
  - "Car colour changes dynamically based on cargo state — red when empty, blue when carrying a pizza."
reflection: |
  Key Unity concepts covered in this project:

  Variables and if statements — the foundation of all game logic (cargo state, speed changes, win condition).

  Triggers and colliders — distinguishing between physics colliders (solid objects) and trigger volumes (detecting overlap without physical response).

  Components — understanding Unity's component model and how scripts, renderers, and physics bodies attach to GameObjects.

  Referencing — accessing other GameObjects and their components from scripts.

  Serialized fields — exposing script variables to the Unity Inspector for easy tuning without changing code.
groups:
  - "personal"
  - "game-dev"
  - "unity"
---

## Overview

This project represents the first project I would consider a complete game in my game development journey. It was made following a tutorial on Udemy using assets provided by the online course. The game is a small top-down car game — drive around the map collecting pizzas and delivering them to a customer.

> **📷 Carousel — 2 images ready:** `pizza-delivery-1.png`, `pizza-delivery-2.png`
> *(Carousel component not yet implemented — CP9)*

## Approach & Architecture

The game is built in Unity 2022.3.34f1 with C# scripting, using Unity's physics system for all interactions.

**Game elements:**
- **Blue boxes** — pizzas to pick up by driving into them (trigger collider)
- **Red circle** — the person to deliver the pizza to (trigger collider)
- **Orange ellipse** — a speed bump that slows the car on contact; the car continues at reduced speed until it hits a solid object (e.g. a house)
- **Green triangle** — a speed boost that increases the car's speed on contact
- **Car colour** — shaded red when empty, changes to blue once a pizza has been picked up

All interactions use colliders set to trigger mode, meaning they detect overlap without creating a physical collision response. There are currently 3 pizza boxes in the game; once all have been collected and delivered, the game is complete.

## Development & Learning

This project introduced me to the core fundamentals of the Unity engine through a structured Udemy course with supplied assets.

Working through the project covered:
- Using **variables** and **if statements** to control game logic (tracking cargo state, toggling car colour, checking win condition)
- Setting colliders as **triggers** to detect item pickup and delivery without blocking movement
- Understanding Unity's **component** model — attaching scripts, renderers, and Rigidbody2D to GameObjects
- **Referencing** other GameObjects and their components from within C# scripts
- Using `[SerializeField]` to expose configurable values to the Unity Inspector for easy tuning
