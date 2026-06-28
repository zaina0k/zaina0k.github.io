---
title: "Sign Language Translator"
summary: "A Python BSL learning app with GIF-based sign demonstrations, adaptive learning, and an online user profile system."
detail: "Built a British Sign Language learning tool with GIF demonstrations, speech input, an adaptive learning algorithm, and Google Sheets-backed user profiles."
thumbnail: "../../assets/projects/sign-language-translator/slt-4.jpeg"
startDate: 2021-01-01
endDate: 2021-01-15
status: shipped
sortOrder: 3
featured: false
techStack:
  - "Python"
  - "GUIZERO"
  - "Google Sheets API"
  - "speech_recognition"
  - "fuzzywuzzy"
  - "pytube"
  - "hashlib"
  - "smtplib"
tags:
  - "Python"
  - "GUI"
  - "BSL"
  - "Personal"
category: "personal"
role: "Sole Developer"
github: "https://github.com/zaina0k/Sign-Language-Translator"
ogImage: "/og/sign-language-translator.png"
skills:
  - "GUI development"
  - "API integration"
  - "Adaptive algorithms"
  - "Password security"
results:
  - "Working BSL learning app with GIF demonstrations fetched from a YouTube playlist via pytube."
  - "Online user profile system backed by Google Sheets via gspread — supports multiple users without a local database."
  - "Adaptive learning algorithm that increases question frequency for phrases answered incorrectly and retires mastered phrases."
  - "Custom search logic that finds the most efficient BSL signing for a query, including letter-by-letter fallback for names with no direct signing."
  - "Email verification on sign-up using smtplib; passwords hashed via hashlib before storage."
  - "Mic input via speech_recognition + Google API, and fuzzy text matching via fuzzywuzzy for tolerant search."
reflection: |
  <add content here — personal reflections on what you learned building this project>
groups:
  - "university"
  - "python"
  - "accessibility"
media:
  - type: image
    src: /projects/sign-language-translator/slt-1.jpeg
    alt: "Search page"
  - type: image
    src: /projects/sign-language-translator/slt-2.jpeg
    alt: "Email confirmation"
  - type: image
    src: /projects/sign-language-translator/slt-3.jpeg
    alt: "Online database"
  - type: image
    src: /projects/sign-language-translator/slt-4.jpeg
    alt: "Tailored consolidation"
  - type: image
    src: /projects/sign-language-translator/slt-5.jpeg
    alt: "Sign-up data flow"
---

## Overview

Sign Language Translator is a Python project that uses a sign language bank alongside a GUI to allow users to learn BSL (British Sign Language) via GIFs showcasing each action. The project includes an online user profile system and an adaptive learning algorithm designed for better learning efficiency.

BSL is a visual language used by the deaf and hard of hearing as a primary form of communication. The program covers BSL phrases and actions, each represented as a GIF that demonstrates the signing in motion.

## Approach & Architecture

The application is built around four core features:

**Sign Language GIFs**
BSL signings are stored and displayed as GIFs. The pytube library accesses a playlist of BSL signings from YouTube and converts them to locally stored GIFs on first access — subsequent lookups use the cached file for efficiency.

**User Profile System**
A User class stores the user's name, username, hashed password, date joined, email, and custom learning path. This data is serialised and stored in Google Sheets via gspread, allowing multiple users to log in without needing a local profile database. Passwords are hashed with hashlib before storage. Email verification via smtplib is required on sign-up — a verification code is sent that the user must enter to proceed, and it also ensures no two accounts share the same email.

**Tailored Consolidation (Adaptive Learning)**
The user attempts to answer a question and is then shown the correct answer. They self-report whether they got it right or wrong, which updates a consolidation list stored in their profile. Phrases answered incorrectly appear more frequently; phrases consistently answered correctly are retired and replaced with new ones to learn.

**Custom Search Structure**
Some signings are phrases rather than single words (e.g. "good morning"). BSL has signings for both the phrase and the individual words. The program locates the most efficient signing for what the user is searching. For names or words with no direct signing, the program outputs the letter-by-letter signing combination instead. Fuzzywuzzy provides fuzzy text matching — a tolerant autocorrect that finds the closest match in the word bank.

## Development & Learning

The GUI is built with GUIZERO (a tkinter-based library), displaying GIFs and menu navigation. Speech input is supported via the speech_recognition library, which captures mic audio and sends it to Google's speech API, returning a text string that is entered into the search field.

Key modules integrated:

- **gspread** — Google Sheets API access for user profile storage and retrieval
- **pytube** — YouTube playlist access to download and cache BSL signing GIFs locally
- **speech_recognition** — Mic-to-text via Google Speech API
- **fuzzywuzzy** — Fuzzy string matching for tolerant search against the word bank
- **hashlib** — One-way password hashing before storage
- **smtplib** — Email verification on account creation
- **JSON** — Local caching of GIF metadata and progress state

*Credit: Dan St Gallay ([danstg1](https://github.com/danstg1)) — help building the initial signing database.*
