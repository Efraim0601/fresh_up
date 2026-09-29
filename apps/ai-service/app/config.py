from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuration du microservice IA, chargee depuis les variables
    d'environnement (voir .env.example a la racine du monorepo)."""

    ai_service_port: int = 8000
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "qwen2.5:7b-instruct"
    ai_parse_outfit_fallback_enabled: bool = True

    # Niveau 2 (phase 3) - desactive par defaut
    ai_inspiration_enabled: bool = False
    ai_inspiration_provider: str = "none"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
