## Overview

This folder contains the Quarto files for the DAIR seminars.

## Course Introduction

The primary aim of the course is to teach clinicians who have basic Python skills how to work with medical data. Secondary aims of the course include providing high-level context to clinicians without technical skills about how to effectively collect data for data-driven applications, and to provide a broad clincian-focused overview of current technology areas which are applicable to clinical medicine.

## Course Features

The specific features of the course are:

- Practical - Course participants will be coding and learning to work with data that clinicians use on a day-to-day basis
- Relevant - The information is aimed at clinicians and will increase their understanding of technology in medicine
- Interactive - The skills developed will lead towards an end goal in the final session: building a simple ML algorithm to interpret chest radiographs
- Ad-hoc - The workshops can be completed synchronously or asynchronously, which may be a better fit for the busy schedules of medical students and clinicians

An important point to note is that this is **not** designed as a general coding course. The course is aimed at people who are looking to work with medical data with pre-existing coding skills. Pre-course introductory sessions could be held to support with identifying appropriate resources for developing basic skills with Python.

## Course Overview

A general overview of the course is provided below:

1. Course Introduction - introduction to aims of the course, overview of emergent technology use in medicine and radiology.
2. DICOM and Python - opening, processing, and rendering DICOM data with Python. Introduction to core concepts for people unfamiliar with digital image representation (bit depth, Houndsfield units, compression, colour-maps, etc.). *Packages: Pydicom*
3. Datasets and Python - opening, processing and analysing tabular data in Excel format with medical focus. *Packages: Pandas*
4. 3D Printing for Medicine - introduction to 3D anatomy segmentation and 3D printing workflows. *Software required: Invesalius*
5. AI for Medicine Part 1 - using Keras within TensorFlow to build a basic binary chest X-ray classifier. *Packages: Pandas, NumPy, TensorFlow*
6. AI for Medicine Part 2 - how to statistically evaluate the performance of the chest X-ray classifier on test data, and a broad discussion of other types of AI model. *Packages: Pandas, NumPy, TensorFlow*
7. Closing Session - Course summary, feedback, and suggestions for future work

Each course section, aside from introduction and closing sessions, will have a **seminar** and associated **workshop**. The seminars will aim to:
 
- Provide a high-level lay overview of the technology (*"What is 3D printing and what advantages does it bring?"*)
- Provide clincian-centered explanations of the technology (*"Why and when to use Python+pandas over Excel?"*)
- Provide examples of existing technology utilisation within clinical practice (*"How are AI image processing systems being used in healthcare?"*)

whereas the workshops will aim to:

- Give clinicians hands-on, guided example exercises to practice working with medical data with support from a tutor (*"How do I extract the scanner name from a DICOM file header?"*) 
- Teach clinicians how to read documentation so that they can continue to grow their skills after the course (*"How do I use the pandas.DataFrame.mean() function?"*).

All Python elements of the workshops will be run within Google Colabatory notebooks to circumvent the need for local Python installation of complex packages (TensorFlow) by workshop participants. The users will need to install InVesalius locally to complete the 3D printing segmentation workshop. This software is available across Windows, Max OS X and Linux.