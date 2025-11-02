from pydantic import BaseModel, Field


class JWTConfig(BaseModel):
    access_token_secret: str = Field(
        ..., description="Secret key used to sign access tokens"
    )
    access_token_age: int = 3600
    refresh_token_secret: str = Field(
        ..., description="Secret key used to sign refresh tokens"
    )
    refresh_token_age: int = 604800
