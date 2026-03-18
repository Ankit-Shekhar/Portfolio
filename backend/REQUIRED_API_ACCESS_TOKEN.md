# Required API and Access Tokens (Deployment)

This file lists the environment variables and tokens needed to deploy the backend reliably.

## 1) Core Required for Backend Startup

1. `MONGODB_URI`
- Required.
- Used for MongoDB connection (`projects`, `timeline`, `skills`, `contact`, `analytics` data).

2. `REDIS_URL` (or `REDIS_HOST` + `REDIS_PORT` + optional `REDIS_USERNAME`/`REDIS_PASSWORD`)
- Required.
- Used for readiness checks and pipeline event logging/storage.

3. `CHROMA_URL`
- Required.
- Used by vector database for AI knowledge indexing and retrieval.

4. `ADMIN_API_KEY`
- Required.
- Used by protected endpoints via `x-admin-key` header:
  - AI pipeline/admin endpoints
  - contact admin endpoints
  - analytics admin endpoints

## 2) Chroma Cloud-Specific (Required only if using Chroma Cloud)

1. `CHROMA_API_KEY`
- Required for cloud auth.

2. `CHROMA_TENANT`
- Required for cloud client.

3. `CHROMA_DATABASE`
- Required for cloud client.

## 3) LLM Provider Keys (At Least One Recommended)

The backend can still respond with fallback behavior without provider keys, but for proper AI answer quality in deployment, configure at least one provider.

1. Gemini:
- `GEMINI_API_KEY` (required if Gemini is selected)
- Optional: `GEMINI_MODEL`

2. OpenAI:
- `OPENAI_API_KEY` (required if OpenAI is selected)
- Optional: `OPENAI_MODEL`
- Optional: `OPENAI_BASE_URL`

3. Hugging Face Inference:
- `HF_TOKEN` or `HUGGINGFACE_API_KEY` (required if HF is selected)
- Optional: `HF_MODEL`
- Optional: `HF_INFERENCE_ENDPOINT`

Note:
- Current embeddings path is deterministic in-app and does not require a separate embedding API key.
- Hugging Face is currently used as an optional LLM inference provider unless you explicitly wire external embedding inference.

## 4) GitHub Integration Tokens

1. `GITHUB_TOKEN`
- Strongly recommended for production.
- Improves GitHub API limits and reliability for profile/repos/readme endpoints and auto-indexing.

2. `GITHUB_USERNAME`
- Optional default username for indexing jobs and tools.

3. `GITHUB_INDEX_REPO_LIMIT`
- Optional limit for auto-index job depth.

## 5) Deployment and Runtime Config (Non-token but required)

1. `PORT`
- Optional (defaults to `8000`), but should be set by deployment platform.

2. `CORS_ORIGIN`
- Required in production to allow frontend origin.

3. `NODE_ENV`
- Set to `production` in deployment.

4. Optional cache TTL configs
- `GITHUB_PROFILE_CACHE_TTL_SECONDS`
- `GITHUB_REPOS_CACHE_TTL_SECONDS`
- `GITHUB_README_CACHE_TTL_SECONDS`
- `ANALYTICS_SUMMARY_CACHE_TTL_SECONDS`

5. Optional anti-bot config (contact submit)
- `TURNSTILE_SECRET_KEY` (enables Turnstile verification flow)
- `TURNSTILE_REQUIRED` (`true` to require a token when Turnstile is configured)

## 6) Minimum Practical Production Set

Use this minimum set to run the full backend behavior safely:

- `MONGODB_URI`
- `REDIS_URL` (or host/port-based Redis config)
- `CHROMA_URL`
- `ADMIN_API_KEY`
- `CORS_ORIGIN`
- One LLM key set: `GEMINI_API_KEY` or `OPENAI_API_KEY` or `HF_TOKEN`
- `GITHUB_TOKEN` (recommended to avoid rate-limit failures)

## 7) Example .env (Production Skeleton)

```env
PORT=8000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
REDIS_URL=redis://default:<password>@<host>:<port>

CHROMA_URL=https://api.trychroma.com
CHROMA_API_KEY=<your-chroma-api-key>
CHROMA_TENANT=<your-chroma-tenant>
CHROMA_DATABASE=<your-chroma-database>

ADMIN_API_KEY=<your-strong-admin-key>

# Select one or more model providers
GEMINI_API_KEY=<your-gemini-key>
# OPENAI_API_KEY=<your-openai-key>
# HF_TOKEN=<your-huggingface-token>

# Optional cache tuning (seconds)
GITHUB_PROFILE_CACHE_TTL_SECONDS=180
GITHUB_REPOS_CACHE_TTL_SECONDS=180
GITHUB_README_CACHE_TTL_SECONDS=300
ANALYTICS_SUMMARY_CACHE_TTL_SECONDS=120

# Optional Turnstile bot protection
# TURNSTILE_SECRET_KEY=<your-turnstile-secret>
# TURNSTILE_REQUIRED=false

GITHUB_TOKEN=<your-github-token>
GITHUB_USERNAME=Ankit-Shekhar
GITHUB_INDEX_REPO_LIMIT=5
```
