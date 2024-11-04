---
layout: posts
title: "Let's Hack Leicester Hackathon 2024"
permalink: /projects/LetsHackLeicester2024/
date: 2024-11-03]
---

<img src="/assets/images/LHL2024 image 1.png" alt="LHL Image 1" style="width:100%; height:auto;">

## Overview
As a team of 5 we created a web application that would allow students to find projects to work on to put on their portfolio. In addition to this, by creating a user system we would allow users to both post their project ideas as well as join other peoples projects, encouraging collaboration. Portfolio projects are an important part of building an understanding of the technologies being used but also portrays to employers an interest in the subject. More high level and specific projects can allow students to demonstrate this interest towards certain fields such as Data Science, Game Dev and many other fields. 
## Problem Statement
We were tasked with creating an application that would benefit people at the University of Leicester or the wider local community in Leicester. 
The projects would be judged by a panel of people from the Computer Science society as well as proxies from Capital One.  
<br>The marking was based on:
- Solution Viability
- Technical Sophistication of Solution
- Group Cohesion and Overall Teamwork
- Presentation Quality
We felt that our idea provided a solution to University of Leicester Computer Science students who were looking for ways to expand their portfolio but were unsure about where to start or nervous about completing a project alone. 

## Tech Stack and Technical Specifications
Given that we wanted to create a web application we decided to use NEXT.js for our frontend and Python Flask for our backend. For the prototype we decided a simple database was necessary and chose to use SQLite. 
NEXT.js was chosen by our frontend team as it would allow for quick setup and flexibility to fit our idea. Python Flask was chosen as in the backend team we were familiar with Python and integrated well with SQLite which was a lightweight database suitable for prototyping. 
<img src="/assets/images/LHL Architecture Diagram.png" alt="LHL Image 1" style="width:100%; height:auto;">
^Architecture of the solution

## Team Role and Contribution
As the teams were randomly allocated it was essential that we first understood the strengths of the different team members so that we could optimise our production and fairly split the work. Our decision on the idea came from brainstorming as a group but I felt especially keen to progress our project and volunteered as team lead. This meant setting up the Git repository via Github and communication channels via Discord. While my programming role within the team was to work on the backend, as team lead I was ensuring all participants were all on the same page with the project idea and that any individual technical difficulties were dealt with quickly. This specifically included integrating the code from all the team members which required comprehensive understanding of all parts of the project<br><br>
To ensure a well optimised use of our time, we split our group into a front end sub-team and a backend sub-team. My role within the backend team was to create the database with the required tables that would store both our user data and the project ads data. Once this was complete I designed the APIs that would allow the frontend to communicate with the database as well as implementing these APIs into the front end. 
## Results and Performance
Unfortunately we were not able to win the prize for this hackathon due to a few reasons:
- Our presentation ran over the time limit and we were not able to complete speaking about our concept
- Time management was a significant issue within the team which lead to us not being able to complete the project. While we were a team of 5, 2 members had difficulty contributing to the code base. Had we taken this into account, we could have reprioritised our tasks to leverage a dummy backend instead of a fully functional one

- Technical difficulties:
  - While we were able to complete the backend APIs and integrate them we struggled with the front end to make the data presentable. This may have been because of our limited experience with NEXT.js. In future it may be optimal to create the front end completely as a team with dummy data and then move onto the backend. These issues were mostly to do with web site design and layout of the information as well as creating and linking the various pages together. 
  - 2 of the team participants did not have access to their own personal machine. This meant using the university lab machine. However, because we were using dependencies that were not installed on the lab machines they were unable to properly run the code which slowed down the development process.
  - Given that the front end of the application was not ready we did not host the web app. This meant that it was not viable and could not be tested by the judges.

<br>

<img src="/assets/images/LHL Home Page.png" alt="LHL Image 1" style="width:100%; height:auto;">
^Mockup of the home page design

## What to implement in the future
<u>Mentorship: </u><br>
One of the key functionalities that was cut was the mentorship functionality. The idea behind this feature was that users with less experience will still want to do portfolio projects. This would help them get started with their career in the future but it would also allow them to develop interpersonal skills as well as strengthen their understanding of the technologies they would be building. 
Having less experienced students paired with other less experiences students may not be productive since it may just be the blind leading the blind. Having a mentor who could point you in the right direction would help reduce this problem immensely. To facilitate this we could partner with the Computer Science society giving them the ability to make mentors. These would be people that are known within this community to be capable of mentoring. The incentive to become a mentor as a volunteer would be the same as being a member of the committee for the Computer Science society - networking and community work to showcase to employers. 
<br><br>
<u>Social Media Aspects:</u><br>
In order to facilitate people connecting more easily, it would be useful to have common social media features such as 