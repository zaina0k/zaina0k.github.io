---
title: "Projects"
layout: splash
permalink: /projects/
canonical_url: "https://zainaltaf.dev/projects"
---

<br>


<div class="project-tiles">
    <a href="/projects/sign_language_translator/" class="tile" style="background-image: url('/assets/images/SLT4.jpeg');">
        <div class="overlay">
            <h3>Sign Language Translator</h3>
            <p>A-Level project</p>
        </div>
    </a>
    <a href="/projects/elo_ranking/" class="tile" style="background-image: url('/assets/images/elo_ranking2.jpeg');">
        <div class="overlay">
            <h3>Elo Ranking</h3>
            <p>A picture ranking system</p>
        </div>
    </a>
    <a href="/projects/unity_flappy_bird/" class="tile" style="background-image: url('/assets/images/Flappy bird gameplay.png');">
        <div class="overlay">
            <h3>Flappy Bird</h3>
            <p>A clone of the old iPhone game</p>
        </div>
    </a>
    <a href="/projects/unity_snowboarder/" class="tile" style="background-image: url('/assets/images/Snow Boarder 1.png');">
        <div class="overlay">
            <h3>Snow Boarder</h3>
            <p>Sidescroling Snowboarding Game</p>
        </div>
    </a>
    <a href="/projects/unity_pizza_delivery" class="tile" style="background-image: url('/assets/images/Pizza Delivery1.png');">
        <div class="overlay">
            <h3>Pizza Delivery</h3>
            <p>Intro to game development pizza devlivery game</p>
        </div>
    </a>
    <!-- Add more tiles as needed -->
</div>

<style>
.project-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}
.tile {
    position: relative;
    background-size: cover;
    background-position: center;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-decoration: none; /* Remove underline from the entire tile */
}

.overlay {
    background-color: rgba(0, 0, 0, 0.5); /* Darken overlay */
    padding: 20px;
    text-align: center;
    width: 100%;
}

.tile:link, .tile:visited {
    color: white; /* Keep text white */
    text-decoration: none; /* No underline */
}
.tile:hover {
    transform: scale(1.02); /* Slight zoom on hover */
    transition: transform 0.2s;
}
.tile:hover .overlay {
    background-color: rgba(0, 0, 0, 0.7); /* Darken on hover */
}
.tile h3, .tile p {
    color: white; /* Ensure text stays white */
    margin: 0;
}
</style>