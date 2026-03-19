# Portfolio Project - Interview Explanation

## Project Overview

This project is an interactive portfolio designed as a simulated desktop operating system.

Instead of traditional webpages, users interact with a desktop environment containing applications that display the developer's projects and skills.

The system also includes an AI agent capable of answering questions about the developer’s work.

---

# Final Repository Setup

The current repository structure is final.

It is organized into:

* frontend
* backend
* docs

The backend is a standalone Node.js workspace.

That means:

* package management is inside backend
* environment files are inside backend
* the AI subsystem is implemented inside backend/src/ai

---

# Motivation

Traditional portfolios only show static content.

This project demonstrates deeper engineering skills by combining:

frontend systems design  
AI agents  
backend architecture  
vector search systems

---

# Key Features

Terminal based landing page  
OS selection interface  
scroll based OS evolution animation  
desktop window manager  
AI knowledge assistant  
GitHub auto indexing system  
vector search knowledge base  
event logging system

---

# AI System

The AI agent uses Retrieval Augmented Generation.

Project documentation and GitHub README files are converted into vector embeddings.

When a user asks a question:

the backend AI subsystem retrieves relevant documents  
the model receives these documents as context  
the AI generates an answer

---

# Databases Used

MongoDB for structured data.

Vector database for embeddings.

Redis for event logging, distributed rate limiting, and selective TTL caching.

Optional Cloudflare Turnstile verification protects public contact submissions.

---

# AI Development

The AI system is orchestrated from the backend codebase rather than a separate repository layer.

Model provider choice can be changed later without changing the frontend architecture.

---

# System Design Concepts

AI agent architecture  
tool based reasoning  
retrieval augmented generation  
vector databases  
observability systems  
desktop UI simulation  
domain-driven backend modules

---

# Challenges

Managing AI inference with limited hardware.

Designing a realistic desktop UI.

Building an automated GitHub indexing pipeline.

Keeping the docs aligned with the actual repository structure.

---

# Outcome

The final system acts as a knowledge assistant for the developer's portfolio and demonstrates frontend engineering, backend modular architecture, and AI system design in one repository.