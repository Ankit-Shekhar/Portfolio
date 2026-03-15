# Complete System Architecture

## System Overview

The system consists of four main layers.

Frontend OS Simulation  
Backend API Layer  
AI Agent System  
Data Storage Layer

---

# High-Level Architecture

User
│
▼
React Portfolio OS
│
▼
Backend API (Node.js + Express)
│
├── AI Agent Controller
├── GitHub Indexing Pipeline
├── Project API
├── Contact API
├── Timeline Story Service
└── Event Logger
│
▼
Databases
│
├── MongoDB
├── Chroma Vector Database
└── Redis

---

# Frontend Architecture

The frontend simulates an operating system.

Major modules:

Terminal Landing Interface  
OS Evolution Animation  
Desktop Environment  
Window Manager  
Application Launcher  

Applications:

Projects App  
Skills App  
Architecture Viewer  
AI Agent Window  
Broken Dreams Timeline  

---

# Window Manager

The window manager handles:

opening apps  
closing windows  
dragging windows  
resizing windows  
window stacking  

---

# AI Agent Architecture

The AI agent follows a tool-based reasoning architecture.

Available tools include:

vector_search  
read_file  
list_directory  
get_project_details  
github_fetch  

---

# Query Processing Flow

User Query
│
▼
Frontend sends API request
│
▼
Agent Controller receives query
│
▼
Model determines intent
│
▼
Tool is selected
│
▼
Tool retrieves information
│
▼
AI generates response
│
▼
Frontend renders answer

---

# GitHub Indexing Pipeline

Steps:

Fetch repositories from GitHub  
Extract README content  
Chunk documentation  
Generate embeddings  
Store in vector database  

---

# Broken Dreams Timeline System

The timeline content is stored in MongoDB.

Example data structure:

timeline_events

Fields:

title  
description  
year_range  
animation_scene  
visual_assets  

The frontend renders these scenes using animation libraries.

---

# Data Storage

MongoDB

projects  
skills  
timeline_events  
contact_messages  

Chroma Vector DB

project documentation embeddings

Redis

event logs  
agent state caching  

---

# Deployment

Frontend

Vercel

Backend

Render

Database

MongoDB Atlas

Vector DB

Chroma

AI

HuggingFace inference