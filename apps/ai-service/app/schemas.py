from typing import Optional

from pydantic import BaseModel, Field


class ParseOutfitRequest(BaseModel):
    description: str = Field(
        ...,
        description="Description libre en francais, ex: "
        "'chemise cintree, manches courtes, col mao, longueur hanches'",
        min_length=1,
        max_length=1000,
    )


class ParseOutfitResult(BaseModel):
    """Schema de sortie du niveau 1 d'IA (obligatoire).

    Valeurs alignees sur le kit de pieces modulaires du mannequin (voir
    docs/3D_ASSET_SPEC.md et docs/ARCHITECTURE.md). Si une valeur demandee
    par le client n'existe pas dans le kit, le champ correspondant doit
    contenir la valeur la plus proche disponible, et `warnings` doit le
    signaler explicitement au client.
    """

    type: Optional[str] = None
    coupe: Optional[str] = None
    manches: Optional[str] = None
    col: Optional[str] = None
    longueur: Optional[str] = None
    confiance: float = Field(0.0, ge=0.0, le=1.0)
    warnings: list[str] = Field(default_factory=list)
    source: str = Field(
        description="'llm' si le modele Ollama a repondu, "
        "'fallback_rules' si le repli par mots-cles a ete utilise"
    )


class InspirationImageRequest(BaseModel):
    fabric_image_url: str
    prompt: Optional[str] = None


class InspirationImageResult(BaseModel):
    status: str
    image_url: Optional[str] = None
    disclaimer: str = (
        "Image d'inspiration generee par IA - ne represente pas fidelement "
        "le rendu final du vetement."
    )
