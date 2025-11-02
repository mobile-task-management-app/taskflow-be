from dataclasses import dataclass
import httpx

from app.core.configs.google_oauth2_config import GoogleOauth2Config
from app.core.exceptions.auth_exception import AuthException, AuthExceptionType
from app.core.exceptions.internal_server_exception import InternalException
from app.modules.auth.services.dtos.oauth2_google_dto import GoogleUserInfo, Oauth2Token


class GoogleOauth2Service:
    def __init__(self, oauth2_config: GoogleOauth2Config):
        self.oauth2_config = oauth2_config

    async def exchange_token(self, auth_code: str, code_verifier: str) -> Oauth2Token:
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": auth_code,
            "client_id": self.oauth2_config.client_id,
            "client_secret": self.oauth2_config.client_secret,
            "redirect_uri": self.oauth2_config.redirect_uri,
            "grant_type": "authorization_code",
            "code_verifier": code_verifier,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code >= 400:
                raise AuthException(AuthExceptionType.INVALID_GOOGLE_AUTH_CODE)
            else:
                tokens = resp.json()
                return Oauth2Token(
                    access_token=tokens["access_token"],
                    refresh_token=tokens["refresh_token"],
                )

    async def get_user_info(self, access_token: str) -> GoogleUserInfo:
        info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    info_url, headers={"Authorization": f"Bearer {access_token}"}
                )
                user_info = resp.json()
                return GoogleUserInfo(
                    fist_name=user_info["family_name"],
                    last_name=user_info["given_name"],
                    email=user_info["email"],
                    image=user_info["picture"],
                )
        except httpx.RequestError as e:
            raise AuthException(AuthExceptionType.INVALID_GOOGLE_AUTH_CODE)
        except Exception as e:
            raise InternalException(e)
