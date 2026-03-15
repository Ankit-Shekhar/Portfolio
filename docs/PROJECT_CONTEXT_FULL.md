# AI Portfolio Operating System

## Full Project Context

---

# 1. Project Overview

This project is an advanced **interactive portfolio platform** that simulates a **desktop operating system experience** inside a web browser.

Instead of a traditional scrolling website, visitors interact with a **desktop interface**, open applications, explore projects, and communicate with an **AI agent** that can answer questions about the developer's work.

The portfolio combines:

* storytelling
* system design
* artificial intelligence
* interactive UI
* data analytics

to create an experience that feels like exploring a **personal operating system**.

The goal is to demonstrate strong capabilities in:

* full-stack engineering
* AI system design
* frontend architecture
* backend modular architecture
* developer storytelling

---

# 2. Key Goals of the Project

The system is designed to achieve the following goals.

### 1. Create an unforgettable portfolio experience

Instead of static sections, users interact with:

* terminal interfaces
* desktop icons
* window systems
* animated timelines

This makes the portfolio highly memorable for recruiters and engineers.

---

### 2. Demonstrate strong engineering skills

The project showcases knowledge of:

* modular backend architecture
* state management
* system design
* vector search systems
* AI pipelines
* background job processing

---

### 3. Build an AI agent capable of answering questions

Visitors can ask questions like:

* "What projects has Ankit built?"
* "Explain the architecture of AroundU."
* "What technologies does Ankit know?"

The AI agent will retrieve information from:

* project documentation
* GitHub repositories
* architecture notes
* structured project data

---

### 4. Tell a personal story through technology

The **Broken Dreams Timeline** allows the developer to narrate important life events through an animated storytelling interface.

Instead of listing achievements, the system tells the **journey behind them**.

---

### 5. Collect useful portfolio interaction insights

The system includes a **visitor analytics module** that tracks how people interact with the portfolio.

This helps understand:

* which projects attract attention
* what questions recruiters ask
* how long visitors explore the system

This transforms the portfolio into a **data-aware system**.

---

# 3. Portfolio Flow (User Journey)

The system guides the visitor through a structured experience.

---

## Step 1 — Terminal Landing Interface

When the website opens, the user sees a **terminal-style interface**.

Example commands may appear:

```
> boot portfolio
> loading developer profile...
> initializing operating system...
```

The terminal introduces the developer and prepares the user for the experience.

---

## Step 2 — OS Selection

The visitor selects the interface style:

* Windows style
* macOS style

This selection loads the operating system UI.

---

## Step 3 — OS Evolution Animation

Before entering the desktop, the user scrolls through a **timeline of operating system evolution**.

Example progression:

Windows XP → Windows 7 → Windows 10 → Windows 11

This animation symbolises the **developer's technological evolution**.

---

## Step 4 — Desktop Environment

The visitor then enters the **desktop interface**.

The desktop contains interactive applications represented as icons.

Example desktop icons:

* Projects
* Skills
* Architecture
* AI Agent
* Dreams
* Contact

Users can open these applications just like a real operating system.

---

# 4. Desktop Applications

Each desktop icon launches an application window.

---

## Projects Application

Displays all major projects.

Each project contains:

* description
* technologies used
* GitHub repository
* architecture diagrams
* impact explanation

---

## Skills Application

Displays technical skills grouped into categories.

Example groups:

* Programming Languages
* Backend Technologies
* Frontend Technologies
* Databases
* DevOps Tools
* AI Tools

---

## Architecture Viewer

Shows system design diagrams of complex projects.

Examples:

* AroundU architecture
* AI portfolio architecture
* data pipelines
* backend infrastructure

---

## AI Agent Application

A conversational AI assistant integrated into the portfolio.

Visitors can ask questions about the developer.

Example queries:

* "Explain the AroundU project."
* "What backend technologies does Ankit use?"
* "How does the AI agent work?"

The AI agent retrieves relevant information using a **Retrieval Augmented Generation (RAG) pipeline**.

---

## Agent Pipeline Renderer

While the AI agent processes questions, the system visualizes its internal pipeline.

Example pipeline steps:

1. Query received
2. Query embedding created
3. Vector search executed
4. Relevant documents retrieved
5. Context sent to LLM
6. Response generated

This helps users understand **how the AI system works internally**.

---

## Broken Dreams Timeline

This is a storytelling application.

It visualizes significant moments in the developer's life.

Example events:

* Dream of joining the Air Force
* Academic struggles
* Discovering programming
* Building first major project

Each event appears as an animated scene on a timeline.

This makes the portfolio emotionally engaging.

---

## Contact Application

Visitors can contact the developer directly.

The form collects:

* name
* email
* message

Messages are stored in the backend database.

---

# 5. AI System Overview

The AI agent uses a **Retrieval Augmented Generation architecture**.

Information sources include:

* project documentation
* GitHub repository READMEs
* architecture files
* developer notes

Process flow:

1. User question received
2. Question converted into embeddings
3. Vector database search performed
4. Relevant documents retrieved
5. Context sent to language model
6. Response generated

This ensures answers are grounded in real project data.

---

# 6. GitHub Repository Indexing

The system automatically indexes the developer's GitHub repositories.

Process:

1. Repositories are fetched via GitHub API.
2. README files and documentation are extracted.
3. Content is broken into chunks.
4. Chunks are converted into embeddings.
5. Embeddings are stored in a vector database.

This allows the AI agent to answer questions about real projects.

---

# 7. Visitor Analytics System

The portfolio includes a **lightweight analytics system**.

Its goal is to understand how users interact with the portfolio.

Tracked events include:

* page visits
* project views
* AI questions asked
* timeline interactions
* session duration

Example analytics event:

```json
{
  "eventType": "project_view",
  "projectId": "aroundu",
  "timestamp": "2026-03-14T11:20:00"
}
```

These events are stored in a database collection.

Analytics insights may include:

* total visitors
* most viewed project
* most asked AI questions
* average time spent on the portfolio

This turns the portfolio into a **data-aware system**.

---

# 8. System Design Philosophy

The project follows several engineering principles.

### Modular Architecture

Backend is designed using **domain-driven modules**.

Each feature is isolated into its own module.

Example modules:

* projects
* skills
* timeline
* ai-agent
* analytics

---

### Separation of Concerns

Responsibilities are clearly separated:

* frontend handles UI
* backend handles business logic
* AI layer handles intelligence

---

### Scalable Design

The architecture allows the system to grow without becoming difficult to maintain.

New applications can easily be added to the desktop.

---

# 9. Technologies Used

Frontend technologies include:

* React
* modern animation libraries
* component-based architecture

Backend technologies include:

* Node.js
* Express
* MongoDB
* Redis

AI system technologies include:

* vector embeddings
* vector database
* retrieval pipelines

Developer tooling includes:

* GitHub
* automated repository indexing
* modular backend architecture

---

# 10. Final Vision

The AI Portfolio Operating System is designed to be more than a portfolio.

It is intended to demonstrate:

* creativity
* system design capability
* AI engineering knowledge
* strong full-stack development skills

The project aims to leave a strong impression on recruiters, engineers, and collaborators by presenting technical ability through an **interactive storytelling experience**.
