from dataclasses import dataclass
from datetime import datetime

import bcrypt
from jwt import encode

from app.modules.auth.services.dtos.oauth2_google_dto import GoogleUserInfo
from app.modules.users.db.models.user_create import UserCreate


@dataclass
class User(UserCreate):
    id: int
    current_refresh_token: str
    created_at: datetime
    updated_at: datetime

    def verify_password(self, password: str) -> bool:
        if self.auth_provider != "local":
            return False
        encoded_password = password.encode("utf-8")
        stored_hashed_password = self.password.encode("utf-8")
        return bcrypt.checkpw(encoded_password, stored_hashed_password)
