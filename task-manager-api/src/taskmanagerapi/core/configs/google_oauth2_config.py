from pydantic import BaseModel, Field


class GoogleOauth2Config(BaseModel):
    client_id: str = "mock"
    client_secret: str = "mock"
    redirect_uri: str = "http://localhost:8000/auth/callback"
