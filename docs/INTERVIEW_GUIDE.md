# Portfolio Project — Interview Explanation

## Project Overview

This project is an interactive portfolio designed as a simulated desktop operating system.

Instead of traditional webpages, users interact with a desktop environment containing applications that display the developer's projects and skills.

The system also includes an AI agent capable of answering questions about the developer’s work.

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

the system retrieves relevant documents  
the AI model receives these documents as context  
the AI generates an answer

---

# Databases Used

MongoDB for structured data.

Chroma vector database for embeddings.

Redis for event logging and caching.

---

# AI Development

During development the system uses a local model via Ollama.

Due to hardware constraints a lightweight model such as Phi-3 Mini is used.

For deployment, HuggingFace inference endpoints provide more powerful models.

---

# System Design Concepts

AI agent architecture  
tool based reasoning  
retrieval augmented generation  
vector databases  
observability systems  
desktop UI simulation

---

# Challenges

Managing AI inference with limited hardware.

Designing a realistic desktop UI.

Building an automated GitHub indexing pipeline.

---

# Outcome

The final system acts as a knowledge assistant for the developer’s portfolio and demonstrates both frontend engineering and AI system design.