"""Repli par regles/mots-cles pour /ai/parse-outfit.

Squelette Phase 1 : couverture volontairement minimale (quelques mots-cles
courants), a enrichir en Phase 2 en parallele du kit de pieces reel du
mannequin. Ce module ne fait AUCUN appel reseau/LLM - il sert de filet de
securite quand Ollama est indisponible (cf. AI_PARSE_OUTFIT_FALLBACK_ENABLED).
"""

from app.schemas import ParseOutfitResult

_TYPE_KEYWORDS = {
    "chemise": "chemise",
    "jupe": "jupe",
    "pantalon": "pantalon",
    "robe": "robe",
}

_MANCHES_KEYWORDS = {
    "manches courtes": "courtes",
    "manches longues": "longues",
    "manches 3/4": "3/4",
}

_COL_KEYWORDS = {
    "col mao": "mao",
    "col rond": "rond",
    "col v": "v",
    "col chemise": "chemise",
}

_LONGUEUR_KEYWORDS = {
    "longueur hanches": "hanches",
    "longueur genoux": "genoux",
    "longueur cheville": "cheville",
}

_COUPE_KEYWORDS = {
    "cintree": "cintree",
    "ample": "ample",
    "droite": "droite",
}


def _find_first(text: str, keywords: dict[str, str]) -> str | None:
    for phrase, value in keywords.items():
        if phrase in text:
            return value
    return None


def parse_outfit_with_rules(description: str) -> ParseOutfitResult:
    text = description.lower()

    result = ParseOutfitResult(
        type=_find_first(text, _TYPE_KEYWORDS),
        coupe=_find_first(text, _COUPE_KEYWORDS),
        manches=_find_first(text, _MANCHES_KEYWORDS),
        col=_find_first(text, _COL_KEYWORDS),
        longueur=_find_first(text, _LONGUEUR_KEYWORDS),
        confiance=0.4,  # confiance volontairement basse : repli mots-cles
        source="fallback_rules",
    )

    if result.type is None:
        result.warnings.append(
            "Type de vetement non reconnu - merci de preciser "
            "(chemise, jupe, pantalon, robe...)."
        )

    return result
