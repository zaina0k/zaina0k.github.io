---
title: "Sign Language Translator — Real-Time Hand Gesture Recognition"
summary: "Computer vision application that classifies hand gestures from webcam input and translates them to text in real time."
detail: "Machine learning model trained to classify hand gestures from webcam input and translate them to text in real time."
thumbnail: "../../assets/thumbnails/sign-language-translator.png"
date: 2023-05-20
sortOrder: 3
featured: true
techStack:
  - "Python"
  - "OpenCV"
  - "TensorFlow"
  - "MediaPipe"
  - "NumPy"
tags:
  - "Python"
  - "Computer Vision"
  - "ML"
category: "personal"
role: "Sole Developer"
github: "https://github.com/zainaltaf/sign-language-translator"
liveDemo: ""
skills:
  - "Machine learning"
  - "Computer vision"
  - "Model training"
  - "Real-time processing"
---

## The Problem

Sign language is the primary communication mode for a significant portion of the deaf and hard-of-hearing community, yet most interfaces — screens, keyboards, voice assistants — are designed exclusively for spoken or written language. Bridging that gap typically requires a human interpreter or specialised hardware.

This project explored whether a standard laptop webcam, combined with a trained classification model, could serve as a real-time sign language interpreter without additional hardware. The goal was a working proof of concept: point the camera at a hand, see the recognised gesture rendered as text.

## The Approach

The pipeline has two distinct stages: hand landmark extraction and gesture classification.

**Stage 1 — Landmark extraction (MediaPipe Hands)**
Rather than feeding raw pixels into a classifier, I used Google's MediaPipe Hands library to extract 21 3D hand landmarks per frame. This normalises for scale, position, and skin tone — challenges that would otherwise require a much larger and more diverse training dataset. The output of this stage is a fixed-length vector of (x, y, z) coordinates, not an image.

**Stage 2 — Gesture classification (TensorFlow / Keras)**
The landmark vectors were fed into a small dense neural network: three fully connected layers with ReLU activations, dropout for regularisation, and a softmax output layer. The network was trained on a custom dataset I recorded for each gesture class.

## Architecture

```
Webcam frame (BGR image)
        │
        ▼
MediaPipe Hands
  ├── Detect hand region
  └── Extract 21 landmarks → [x0,y0,z0, x1,y1,z1, ..., x20,y20,z20]
        │
        ▼
Normalisation (relative to wrist landmark)
        │
        ▼
Dense Neural Network (TensorFlow/Keras)
  ├── Dense(128, relu) + Dropout(0.2)
  ├── Dense(64, relu)  + Dropout(0.2)
  └── Dense(n_classes, softmax)
        │
        ▼
Predicted gesture label → overlay on frame via OpenCV
```

The full loop ran at approximately 20 frames per second on a standard laptop — fast enough for real-time feedback.

## My Contribution

- Collected and labelled the training dataset: recorded 300+ samples per gesture class using the webcam, capturing variation in hand angle and distance
- Built the MediaPipe integration and landmark normalisation pipeline
- Designed and trained the classification network; iterated on architecture and dropout values to reduce overfitting
- Built the OpenCV display loop that overlays the recognised gesture on the live camera feed
- Evaluated accuracy per class and identified which gestures were systematically confused (similar landmark patterns)

## Key Outcomes

- Achieved over 90% classification accuracy on the held-out test set across the implemented gesture classes
- Real-time inference at 20 fps with no GPU required — runs on CPU on a standard laptop
- The landmark-normalisation approach made the model robust to changes in hand position and scale without requiring a large dataset

## What I Learned

The landmark normalisation step was the key insight that made the project tractable. Training a CNN on raw images of hand gestures would have required thousands of examples per class and careful dataset diversity. By offloading the hard computer vision work to MediaPipe and giving the classifier a compact, normalised representation, the network could generalise well from a few hundred examples per class.

The other lesson was about confusion analysis. Looking at which classes the model confused — rather than just the overall accuracy — revealed that a few gesture pairs with similar finger positions needed either more training data or a slight redesign of the gesture itself. Accuracy by class is more informative than accuracy overall.
