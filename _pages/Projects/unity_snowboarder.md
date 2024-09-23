---
layout: posts
title: "Snowboarder Game"
permalink: /projects/unity_snowboarder/
date: 2024-07-24
---


<img src="/assets/images/Snow Boarder 2.png" alt="Snow Boarder Game Banner" style="width:100%; height:auto;">


## Overview
This project continues my game development journey. It showcases the use of a moving physics based sprite on a sidescrolling platform. The aim is to complete the level without dying (hitting the sprite's head). A rotation and boost control allows the user to do flips off the slopes.

## Technologies Used
The game was made using Unity 2022.3.34f1

## Gameplay
- The premise of the game is to complete the sidescrolling level without dying
- There is currently no points system or way for the user to compare progress to another player
- Completion of the level is determined by passing the green flag at the end of the level
- The user can control the player sprite by rotating him in mid-air as well as boosting his speed while on the ground
- Higher speeds before a ledge allow for longer air time = more flips (flips could be used towards a point system as a measurable variable in the future)

## Development Process
This project is a demo project that showcases my introduction to the fundamentals of Unity. Using an online course explaining the key concepts and supplied assets, I was able to put together this project.
- The first thing created in the project was the ground sprite and the texture of the snow
- I then worked on the player sprite, focussing on the movement mechanics and respective colliders. This included a collider for the head which separately allows for the death sequence to propogate.
- I then created the death process and win process which both caused the scene to restart.
- For the final touches I added environment sprites as well as particle effects for various scenarios including: win state, death state, touching the snow.

## Reflection and Next Steps
Some of the key concepts covered in this project were:
- Sprite shapes
- Edge colliders
- Cinemachine follow camera
- Scene management
- Particle Effects
- Intro to sound effects
