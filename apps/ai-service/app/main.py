from fastapi import FastAPI, HTTPException

from app.config import settings
from app.fallback_parser import parse_outfit_with_rules
from app.schemas import (
    InspirationImageRequest,
    InspirationImageResult,
    ParseOutfitRequest,
    ParseOutfitResult,
)

app = FastAPI(
    title="Fresh Up - AI service",
    description="Microservice IA (parse-outfit niveau 1, inspiration-image niveau 2)",
    version="0.1.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "fresh-up-ai-service"}


@app.post("/ai/parse-outfit", response_model=ParseOutfitResult)
def parse_outfit(payload: ParseOutfitRequest) -> ParseOutfitResult:
    """Niveau 1 (obligatoire) : description libre en francais -> JSON structure.

    Phase 1 (ce scaffold) : seul le repli par regles/mots-cles est branche.
    L'appel au LLM local (Ollama, cf. docs/ARCHITECTURE.md #5) sera ajoute en
    Phase 2 ; ce endpoint restera retro-compatible avec le meme schema de
    sortie.
    """
    if not settings.ai_parse_outfit_fallback_enabled:
        raise HTTPException(
            status_code=503,
            detail="parse-outfit indisponible : LLM non configure et repli desactive",
        )
    return parse_outfit_with_rules(payload.description)


@app.post("/ai/inspiration-image", response_model=InspirationImageResult)
def inspiration_image(payload: InspirationImageRequest) -> InspirationImageResult:
    """Niveau 2 (optionnel, Phase 3) : image d'inspiration via SDXL/FLUX.1
    schnell. Non implemente en Phase 1 - le contrat d'API est fige des
    maintenant pour ne pas casser le front plus tard."""
    if not settings.ai_inspiration_enabled:
        raise HTTPException(
            status_code=501,
            detail="inspiration-image non implemente en Phase 1 (prevu Phase 3)",
        )
    raise HTTPException(status_code=501, detail="Not implemented")
