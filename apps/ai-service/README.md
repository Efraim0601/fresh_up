# @fresh-up/ai-service

Microservice IA (Python/FastAPI), separe du backend metier.

## Dev

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# ou depuis la racine : pnpm dev:ai
```

- `GET /health`
- `POST /ai/parse-outfit` - niveau 1 (obligatoire). En Phase 1, seul le repli
  par regles/mots-cles (`app/fallback_parser.py`) est branche ; l'appel au
  LLM local (Ollama) est prevu en Phase 2 (voir `docs/ARCHITECTURE.md`).
- `POST /ai/inspiration-image` - niveau 2 (Phase 3), retourne `501` tant que
  `AI_INSPIRATION_ENABLED=false`.

Voir `../../docs/PHASE1_TASKS.md` et `../../docs/ARCHITECTURE.md` pour le
detail des niveaux d'IA et les decisions ouvertes.
