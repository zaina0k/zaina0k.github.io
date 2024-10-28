---
layout: posts
title: "Elo Ranking"
permalink: /projects/elo_ranking/
date: 2023-01-14
---
<img src="/assets/images/elo_ranking2.jpeg" alt="Elo Ranking 2" style="width:100%; height:auto;">

## Description
Elo ranking is a python project that showcases the elo ranking system commonly used in chess in the context of comparing photos.  

The elo ranking system is a system devised to compare to players (in this case photos) and add or subtract (whether they win or lose) from their rating based on how likely they were to win.
For example, all items start with the same rating (1500) and are therefore all equally likely to win or lose but an item with 400 elo more than its competition will be 10x more likely to win

## Modules:  

GUIZERO (https://lawsie.github.io/guizero/about/) 
A tkinter based library to provide a GUI for the user.
GUIZERO allows for the program to display the photos to be compared and contains a menu system that allows the user to view the current stats of individual photos.

Matplotlib (https://matplotlib.org)
A graphing library that allows the project to showcase 1 or more pictures' history as a line chart.
This allows the user to see the progress of individual pictures in terms of their rating.

JSON (https://docs.python.org/3/library/json.html)
A library that allows the picture item objects to be serialised and saved into a file that is stored in the current directory.
The JSON file acts as a local database to save and load the rating and progress of the photo item objects.

  
## List of features  
Start page:  
- 2 photo items displayed on GUI  
- Labels for photo items from their file name  
- Buttons for user to "choose" each option - refreshes to new options when an option has been selected  
- Rank based matchmaking (main.py chooseCompetitors function) This function uses the random module in tandem with an array (population) that stores all the picture item objects. It selects the items to stage for comparison semi-randomly. First it will check if item1 (the left picture) was the same as last time - this makes it so that at least 1 of the pictures will always be different and not get stuck comparing the same pictures multiple times in a row. Next to select item2 (the right picture) it randomly selects 3 items (different to item1) and out of them selects which has the closest rank to item1. The number of items it initially selects (var: options) for item2 can be increased in order to increase the level of matchmaking. However, it must always be less than the total population. This function allows for the program to simulate a fair play structure by comparing similarly ranked items, whilst also allowing the randomness to extend a range of comparisons.  

Settings page:  
- Save button - serialises all item objects to json and stores it in a local file (db.json)  
- Display top 5 rated - sorts population by current ranking and displays the top 5  
- Individual item rank history - Allows user to select a photo item by its name. Once selected the photo is then displayed to the user alongside its current rating as well as a graph to show its rating history  

Dev page:  
- Simulate - Textbox alongside button that allows user to simulate the photo comparisons randomly up to 100 times. Data is stored in the photo items as usual to be saved  
- Full graph - Slider alongside a button that allows the user to show all the item rating history charts on one graph. The number that the user chooses (e.g. 5) will be the number will be the top (5) rated items  
- Full Reset - Clears the local database and all the program stored data  
- History - Outputs to terminal the most frequently compared photo item  

<img src="/assets/images/elo_ranking1.jpeg" alt="Elo Ranking 1" style="width:100%; height:auto;">
Figure 1:
Showcasing the photo comparison GUI. There are 2 photos with a button either side for the user to choose a "winner"


<img src="/assets/images/elo_ranking2.jpeg" alt="Elo Ranking 2" style="width:100%; height:auto;">
Figure 2:
Showcasing the individual rank feature. A drop down box allows the user to select a photo item to showcase. The specific image is shown alongside the rank as well as a graph of the rating history.


<img src="/assets/images/elo_ranking3.jpeg" alt="Elo Ranking 3" style="width:100%; height:auto;">
Figure 3:
Showcasing the group rank feature. Using a slider the user can choose a set amount of picture item graphs to plot. This overlay allows the user to view the progression over time. (slider organises by the best currently rated photos. i.e. 5 on the slider will plot the top 5 ranked photos)

<img src="/assets/images/elo_ranking4.jpeg" alt="Elo Ranking 4" style="width:100%; height:auto;">
Figure 4:
Showcasing the flow of data within the program

note: all pictures taken by yours truly  
credit to Matt Tansey for help with "rating history list bug fix" :)
