---
layout: posts
title: "Flappy Bird"
permalink: /projects/unity_flappy_bird/
date: 2024-07-24
---


<iframe width="560" height="315" src="https://www.youtube.com/embed/UhEKREfcWCc?si=AF3b26nmgyJYXhLl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Overview
This project acted as an exercise to test my experience and knowledge of Unity to build a game from scratch. I chose to remake Flappy Bird, an old popular iPhone arcade game. Principly the game is simple... flap the birds wings to get through as many pipes as possible.

## Technologies Used
The game was made using Unity 2022.3.34f1

## Gameplay
- The premise of the game is to not hit the pipes. Using the space bar you can make the bird "flap" its wings to move up. This is important since the gap in the pipe is random and will appear at different spaces.
- There is no win sequence as this is an infinite game and is instead based on how high a score you can achieve. Points are given for every set of pipes the bird passes through.
- The player can play and pause gameplay by hitting the escape key.
- Once the player dies a score card overlay shows the player their score, the best score and the leaderboard. It also allows the player to restart the game or quit. 

## Development Process
Setup:
- I started by collecting all the sprites and assets that I wanted to use throughout the project. This included making a few of the sprites such as the clouds with Aseprite. 
Gameplay:
- I had my assets, I created the bird and worked on its movement, altering the gravity and velocity values in the bird's script.
- I setup the pipes. This included:
  - Creating the collisions that triggers the death sequence.
  - Creating the gap trigger that triggers a point increase.
  - Creating an infinite spawner with a randomised height to create the gameplay loop.
- I setup the backgrounds. This included creating the cloud system using a particle effect with a custom particle - this allowed for the clouds to appear randomly at different speeds and sizes.
- I setup the gameplay scripts that recorded and saved the player score.
- Finally I created the Home, Game Over and Pause screens, incorporating use of the canvas in Unity.

## Reflection and Next Steps
Some of the key concepts covered in this project were:
- Custom sprite designs.
- Multiple screens/scenes.
- Manipulating game timer to allow for the pause screen.
- Use of Unity canvas UI.
- Infinite spawners/randomised gameloop.

What to add next:
- Variable difficulty modes/difficulty increases over time.
- Multiple zones dependent on score - zones could change different backgrounds with different physics settings.
- User login system for online leaderboard.
- Multiple bird skins/sprites - can be choosen by the user.

