# AI Portfolio Operating System
Final Project Folder Structure

This document reflects the finalized repository structure currently used in this project.

The backend remains domain-driven and modular, and the AI system is now part of the backend
codebase under backend/src/ai instead of being maintained as a separate top-level folder.

--------------------------------------------------
ROOT DIRECTORY
--------------------------------------------------

Porfolio/
│
├── frontend/                 # React operating system UI
├── backend/                  # Node.js + Express backend workspace
├── docs/                     # project documentation
│
├── .gitignore
└── README.md

--------------------------------------------------
DOCUMENTATION
--------------------------------------------------

docs/
│
├── PROJECT_CONTEXT_FULL.md
├── SYSTEM_ARCHITECTURE.md
├── INTERVIEW_GUIDE.md
└── FULL_PROJECT_STRUCTURE_DOMAIN_DRIVEN.md

These documents are the source of truth for the current final plan and folder structure.

--------------------------------------------------
FRONTEND (OPERATING SYSTEM UI)
--------------------------------------------------

frontend/

React application simulating a desktop operating system.

frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── icons/
│       ├── images/
│       └── animations/
│
└── src/
    │
    ├── app/
    │   ├── App.jsx
    │   ├── router.jsx
    │   └── providers.jsx
    │
    ├── os/
    │   ├── terminal/
    │   │   ├── TerminalLanding.jsx
    │   │   └── OSSelector.jsx
    │   │
    │   ├── evolution/
    │   │   ├── OSEvolution.jsx
    │   │   └── versions/
    │   │       ├── windowsXP.jsx
    │   │       ├── windows7.jsx
    │   │       ├── windows10.jsx
    │   │       └── windows11.jsx
    │   │
    │   ├── desktop/
    │   │   ├── Desktop.jsx
    │   │   ├── DesktopIcons.jsx
    │   │   └── Wallpaper.jsx
    │   │
    │   ├── dock/
    │   │   ├── Dock.jsx
    │   │   └── DockItem.jsx
    │   │
    │   └── window-manager/
    │       ├── WindowManager.jsx
    │       ├── WindowContext.jsx
    │       └── WindowReducer.js
    │
    ├── apps/
    │   ├── projects/
    │   │   ├── ProjectsApp.jsx
    │   │   ├── ProjectCard.jsx
    │   │   └── ProjectDetails.jsx
    │   │
    │   ├── skills/
    │   │   ├── SkillsApp.jsx
    │   │   └── SkillCategory.jsx
    │   │
    │   ├── architecture/
    │   │   ├── ArchitectureApp.jsx
    │   │   └── ArchitectureViewer.jsx
    │   │
    │   ├── ai-agent/
    │   │   ├── AIAgentApp.jsx
    │   │   ├── ChatWindow.jsx
    │   │   └── MessageBubble.jsx
    │   │
    │   ├── pipeline-renderer/
    │   │   ├── PipelineRenderer.jsx
    │   │   └── PipelineStep.jsx
    │   │
    │   ├── dreams/
    │   │   ├── DreamsApp.jsx
    │   │   ├── Timeline.jsx
    │   │   └── DreamScene.jsx
    │   │
    │   └── contact/
    │       ├── ContactApp.jsx
    │       └── ContactForm.jsx
    │
    ├── services/
    │   ├── apiClient.js
    │   ├── aiService.js
    │   ├── projectService.js
    │   ├── timelineService.js
    │   └── analyticsService.js
    │
    ├── hooks/
    │   ├── useWindowManager.js
    │   └── useAIAgent.js
    │
    ├── animations/
    │   ├── osTransitions.js
    │   ├── windowAnimations.js
    │   └── timelineAnimations.js
    │
    ├── styles/
    │   ├── globals.css
    │   └── themes/
    │       ├── windows.css
    │       └── macos.css
    │
    └── main.jsx

--------------------------------------------------
BACKEND (DOMAIN-DRIVEN ARCHITECTURE)
--------------------------------------------------

backend/

Standalone Node.js + Express workspace for the API, shared backend utilities,
and the AI subsystem.

backend/
│
├── .env
├── .prettierignore
├── .prettierrc
├── package.json
├── package-lock.json
└── src/
    │
    ├── app.js
    ├── constants.js
    ├── server.js
    │
    ├── modules/        # domain modules
    │   ├── projects/
    │   │   ├── project.controller.js
    │   │   ├── project.service.js
    │   │   ├── project.model.js
    │   │   ├── project.routes.js
    │   │   └── project.validation.js
    │   │
    │   ├── skills/
    │   │   ├── skill.controller.js
    │   │   ├── skill.service.js
    │   │   ├── skill.model.js
    │   │   ├── skill.routes.js
    │   │   └── skill.validation.js
    │   │
    │   ├── timeline/
    │   │   ├── timeline.controller.js
    │   │   ├── timeline.service.js
    │   │   ├── timeline.model.js
    │   │   ├── timeline.routes.js
    │   │   └── timeline.validation.js
    │   │
    │   ├── ai-agent/
    │   │   ├── agent.controller.js
    │   │   ├── agent.service.js
    │   │   ├── agent.routes.js
    │   │   └── agent.validation.js
    │   │
    │   ├── github/
    │   │   ├── github.controller.js
    │   │   ├── github.service.js
    │   │   ├── github.routes.js
    │   │   └── github.validation.js
    │   │
    │   ├── contact/
    │   │   ├── contact.controller.js
    │   │   ├── contact.service.js
    │   │   ├── contact.model.js
    │   │   ├── contact.routes.js
    │   │   └── contact.validation.js
    │   │
    │   ├── analytics/
    │   │   ├── analytics.controller.js
    │   │   ├── analytics.service.js
    │   │   ├── analytics.routes.js
    │   │   └── analytics.validation.js
    │   │
    │   └── admin/
    │       ├── admin.controller.js
    │       └── admin.routes.js
    │
    ├── core/           # shared backend system components
    │   ├── config/
    │   │   ├── env.config.js
    │   │   └── ai.config.js
    │   │
    │   ├── database/
    │   │   ├── mongo.connection.js
    │   │   ├── redis.connection.js
    │   │   └── vector.connection.js
    │   │
    │   ├── middlewares/
    │   │   ├── error.middleware.js
    │   │   ├── logger.middleware.js
    │   │   ├── adminAuth.middleware.js
    │   │   └── rateLimit.middleware.js
    │   │
    │   ├── cache/
    │   │   └── redisCache.js
    │   │
    │   └── utils/
    │       ├── ApiError.js
    │       ├── ApiResponse.js
    │       ├── asyncHandler.js
    │       └── logger.js
    │
    ├── jobs/
    │   ├── githubSync.job.js
    │   ├── embedding.job.js
    │   └── repoIndexer.job.js
    │
    └── ai/             # backend-owned AI subsystem
        ├── embeddings/
        │   ├── embedder.js
        │   └── chunker.js
        │
        ├── vector-db/
        │   ├── chromaClient.js
        │   └── vectorStore.js
        │
        ├── github-indexer/
        │   ├── repoFetcher.js
        │   └── readmeParser.js
        │
        ├── agent/
        │   ├── agentController.js
        │   ├── toolSelector.js
        │   └── tools/
        │       ├── vectorSearch.tool.js
        │       ├── readFile.tool.js
        │       ├── listProjects.tool.js
        │       └── githubFetch.tool.js
        │
        └── pipeline/
            ├── pipelineLogger.js
            └── pipelineEvents.js

--------------------------------------------------
DATABASE STRUCTURE
--------------------------------------------------

MongoDB Collections

projects
skills
timeline_events
contact_messages
analytics_events

Vector Database

project documentation
GitHub READMEs
architecture notes

Redis

AI pipeline logs
distributed rate-limit counters
TTL API cache (GitHub reads and analytics summary)

No user session storage is currently used.

--------------------------------------------------
CORE SYSTEM FEATURES
--------------------------------------------------

Terminal Landing Interface
OS Evolution Animation
Desktop OS UI
Window Manager
Projects Explorer
Skills Viewer
Architecture Viewer
AI Agent Chat
Agent Pipeline Renderer
Broken Dreams Timeline
Contact System
GitHub Repo Indexer
Vector Search Engine
Visitor Analytics