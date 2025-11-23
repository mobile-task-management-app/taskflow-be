from dataclasses import dataclass
from typing import Optional


@dataclass
class UserUpdate:
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    auth_provider: Optional[str] = None
    image: Optional[str] = None
    google_refresh_token: Optional[str] = None
    current_refresh_token: Optional[str] = None
