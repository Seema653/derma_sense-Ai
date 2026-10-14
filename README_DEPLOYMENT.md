# DermaSense AI 2.0 — Deployment notes

## Current implementation status
- Flask backend and static frontend are served by the same application.
- `/api/health`, `/api/profile`, `/api/analyze-skin`, `/api/history`, and `/api/products` are implemented.
- Skin image analysis uses OpenCV/Pillow heuristics and produces visual observations, not medical diagnosis.
- `ai_engine/decision_engine.py` contains explainable rule-based recommendations. It is not currently an LLM-powered model.
- The current code does not use an external AI provider API key. Do not paste secrets into frontend JavaScript or commit them to Git.
- Weather recommendations only use weather values supplied to the decision engine; automatic Open-Meteo retrieval is not yet connected.
- The blueprint's mobile/IoT simulation, nutrition planner, progress dashboard charts, chatbot and continuous learning should be verified against requirements and completed if required.

## Run locally
```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python backend/app.py
```
Open http://127.0.0.1:5000 and keep the terminal running.

## Deploy on Render
1. Push this project to a private or public GitHub repository (do not include `.env`, real API keys, or personal uploads).
2. In Render, create a Web Service from the repository. `render.yaml` supplies the build/start command.
3. Wait for build completion and open the service URL.
4. Check `/api/health`, then test profile creation, image upload, analysis, history and product listing.
5. The included SQLite database and uploaded files use local disk. On ephemeral hosting, data can be lost on redeploy/restart. Use a persistent disk or managed database and define a retention/deletion policy before production use.
6. Confirm the host's memory/time limits: OpenCV and concurrent product-page refreshes may need tuning.

## Before public production
- Add rate limiting and CSRF protections if cookie-based sessions are introduced.
- Restrict CORS if the frontend is hosted on a separate origin.
- Validate and clean uploaded files; add a retention policy and delete temporary uploads.
- Review privacy notice and consent for storing skin images/profile data.
- Add automated tests and verify all product links, current prices, and image rights.
- Use a managed database/persistent storage for multi-instance deployments.
- Do not market visual heuristics as a clinically validated AI diagnosis.
