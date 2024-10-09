---
layout: posts
title: "Sign Language Translator"
permalink: /projects/sign_language_translator/
date: 2021-01-01
---
<img src="/assets/images/SLT4.jpeg" alt="Sign Language Translator 4" style="width:100%; height:auto;">
Link to the <a href="https://github.com/zaina0k/Sign-Language-Translator">Github</a> repository 

## Description
Sign language translator is a python project that uses a sign language bank alongside a GUI to allow users to learn sign language via a GIF showcasing the action. The project boasts an online user profile system alongside an adaptive learning algorithm for better learning efficiency.  
For further details on the final product see "Describe the final project" in "Zain Altaf Final Product.pdf"  

## Key Features:  

- Sign Language - Sign language is a language used by the deaf or hard of hearing as a visual form of communication. The program uses BSL (British Sign Language) phrases/actions that are represented in the program as GIFs.  

- User Profile - A class that stores data about the user. Data stored in the user object is serialised and stored in the online database to be accessed when the user logs in. Data points include: name, username, password, date joined and email. the class also stores the users' custom learning path. This is an array that stores phrases to be practised via the adaptive learning algorithm.  

- Tailored Consolidation - The user will attempt to answer a question and then will presented the answer. The user inputs whether they got it right or wrong and a consolidation list stored in the user object is updated. Questions that the user gets wrong will be presented more frequently to the user than those that they got right. If the user keeps getting a question right (i.e. they have mastered a signing) then the question will be replaced with a new one for the user to learn/answer.  

- Custom search structure - Some signings are not words but phrases such as "good morning". Sign language also has phrases for "good" and "morning" separately but the program is designed to locate the most efficient signing for what the user is searching. Furthermore, some signings do not exist (i.e. names of people), therefore, the program will output the signings as a combination of letters instead.  

## Modules Used

- Mic Input - speech_recognition library that takes audio data from mic input and send it to a Google API to be translated into a text string that can be entered into the GUI.   

- Fuzzywuzzy - Search condition that uses a text comparison function comparing what the user enters to a known word bank and finds the closest match. Works as a text input autocorrect.  

- GUIZERO - A tkinter based library to provide a GUI for the user. GUIZERO allows for the program to display the photos to be compared and contains a menu system that allows the user to view the current stats of individual photos.  

- JSON - A library that allows the picture item objects to be serialised and saved into a file that is stored in the current directory. The JSON file acts as a local database to save and load the rating and progress of the photo item objects.  

- Gspread - A library that allows access to google sheets via an API in order to store and access the user profile data. This allows the profile data to be obfuscated from the user and also allows for multiple users to use the program without the need for a local profile database.  

- Pytube - A library that accesses a playlist of BSL signings and converts them to locally stored GIFs. For efficiency purposes this GIF is stored locally once accessed and if needed again is not reinstalled.  

- Hashlib - A library that allows for one way password encryption. Hashing the users password allows for the string to be stored securely in a database.  

- Smtplib - A library that allows for email verification to the user. This send a verification code that the user must enter to proceed with signing up. This also ensures that users can have the same username, name and password but cannot have two accounts with the same email.  

## Images

<img src="/assets/images/SLT1.jpeg" alt="Sign Language Translator 1" style="width:100%; height:auto;">
Figure 1: Search Page   

<img src="/assets/images/SLT2.jpeg" alt="Sign Language Translator 2" style="width:100%; height:auto;">
Figure 2: Sign up email confirmation example    

<img src="/assets/images/SLT3.jpeg" alt="Sign Language Translator 3" style="width:100%; height:auto;">
Figure 3: Online database example   

<img src="/assets/images/SLT4.jpeg" alt="Sign Language Translator 4" style="width:100%; height:auto;">
Figure 4: Tailored consolidation page example (answer has already been revealed)    

<img src="/assets/images/SLT5.jpeg" alt="Sign Language Translator 5" style="width:100%; height:auto;">
Figure 5: Sign up page data flow diagram   


Link to the <a href="https://github.com/zaina0k/Sign-Language-Translator">Github</a> repository  

Credit: Dan St Gallay (Github.com/danstg1) - help building initial signing database

