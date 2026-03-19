# Complete System Architecture

## System Overview

The system consists of three main layers and one embedded intelligence subsystem.

Frontend OS Simulation  
Backend API Layer  
Backend AI Subsystem  
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
├── Project API
├── Skills API
├── Timeline API
├── Contact API
├── Analytics API
├── GitHub Integration API
└── AI Agent API
	│
	├── Agent Controller
	├── Tool Selector
	├── Vector Search Tools
	├── GitHub Indexing Pipeline
	└── Pipeline Event Logger
│
▼
Databases
│
├── MongoDB
├── Vector Database
└── Redis

---

# Repository Layout

The final repository layout is:

Porfolio/  
frontend/  
backend/  
docs/

The backend is a standalone Node workspace with its own package.json, lockfile,
environment file, and integrated AI subsystem inside backend/src/ai.

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
Pipeline Renderer  
Broken Dreams Timeline  
Contact App

---

# Window Manager

The window manager handles:

opening apps  
closing windows  
dragging windows  
resizing windows  
window stacking

---

# Backend Architecture

The backend is organized around feature modules and shared core components.

Feature modules:

projects  
skills  
timeline  
ai-agent  
github  
contact  
analytics  
admin

Core backend areas:

config  
database  
cache  
middlewares  
utils  
jobs

Security and platform controls:

admin API key guard (`x-admin-key`)  
Redis-backed distributed rate limiting (with in-memory fallback)  
Redis TTL response caching for selected read endpoints  
optional Turnstile verification for contact submissions

---

# AI Subsystem Architecture

The AI subsystem is part of the backend codebase under backend/src/ai.

Its main areas are:

embeddings  
vector-db  
github-indexer  
agent  
pipeline

Available tool categories include:

vector_search  
read_file  
list_projects  
github_fetch

---

# Query Processing Flow

User Query
│
▼
Frontend sends API request
│
▼
Backend AI endpoint receives query
│
▼
Agent controller evaluates request
│
▼
Tool is selected
│
▼
Relevant project context is retrieved
│
▼
LLM generates response
│
▼
Frontend renders answer

---

# Frontend Integration Contracts

Public endpoints (frontend default mode):

projects, skills, timeline, AI query, contact submit, GitHub reads, analytics event tracking

Protected endpoints (require `x-admin-key`):

AI pipeline events/diagnostics/index controls  
contact admin list/update/delete  
analytics admin list/summary  
admin mode verify endpoint (`GET /api/v1/admin/verify`)

---

# GitHub Indexing Pipeline

Steps:

Fetch repositories from GitHub  
Extract README content  
Chunk documentation  
Generate embeddings  
Store results in the vector layer

---

# Broken Dreams Timeline System

The timeline content is stored in MongoDB.

Example collection:

timeline_events

Fields:

title  
description  
year_range  
animation_scene  
visual_assets

The frontend renders these scenes through the timeline application.

---

# Data Storage

MongoDB

projects  
skills  
timeline_events  
contact_messages  
analytics_events

Vector Database

project documentation embeddings  
README embeddings  
architecture notes

Redis

event logs  
distributed rate limiting counters  
TTL cache for GitHub profile/repos/readme responses  
TTL cache for analytics summary responses

Note:

No user login session storage is used in the current portfolio backend design.

---

# Deployment Direction

Frontend

Deployed separately as the UI application.

Backend

Deployed as the main API and AI orchestration service.

Database

MongoDB Atlas

Vector Layer

Chroma or an equivalent vector store behind the backend AI subsystem.

AI Inference

Handled through the backend AI subsystem using the selected model provider.