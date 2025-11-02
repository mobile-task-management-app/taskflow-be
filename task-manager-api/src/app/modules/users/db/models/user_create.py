from dataclasses import dataclass
import bcrypt
from app.modules.auth.services.dtos.oauth2_google_dto import GoogleUserInfo
from app.modules.auth.services.dtos.sign_up_dto import SignUpInputDTO


@dataclass
class UserCreate:
    first_name: str
    last_name: str
    email: str
    password: str
    auth_provider: str
    image: str
    google_refresh_token: str

    @classmethod
    def hash_password(cls, password: str) -> str:
        encoded_password = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(encoded_password, salt)
        return hashed_password.decode("utf-8")

    @classmethod
    def user_with_google(cls, google_info: GoogleUserInfo) -> "UserCreate":
        return cls(
            first_name=google_info.fist_name,
            last_name=google_info.last_name,
            email=google_info.email,
            password="",
            auth_provider="google",
            image=google_info.image,
            google_refresh_token="",
        )

    @classmethod
    def user_with_auth_local(cls, dto: SignUpInputDTO) -> "UserCreate":
        hashed_password = cls.hash_password(dto.password)
        return cls(
            first_name=dto.first_name,
            last_name=dto.last_name,
            email=dto.email,
            password=hashed_password,
            auth_provider="local",
            image="",
            google_refresh_token="",
        )
