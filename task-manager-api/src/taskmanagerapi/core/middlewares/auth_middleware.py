from dataclasses import dataclass
import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from taskmanagerapi.core.context.user_context import UserContext
from taskmanagerapi.core.schemas.error_response_schema import ErrorResponseSchema
from taskmanagerapi.core.server import Server
from taskmanagerapi.modules.auth.services.jwt_service import JwtService


@dataclass
class ApiRoute:
    method: str
    uri: str


PUBLIC_APIS: list[ApiRoute] = [
    ApiRoute("POST", "/auth/exchange"),
    ApiRoute("POST", "/auth/sign-in"),
    ApiRoute("POST", "/auth/sign-up"),
    ApiRoute("GET", "/docs"),
    ApiRoute("GET", "/openapi.json"),
]


class AuthMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method

        if path.startswith("/api/v1"):
            stripped_path = path[len("/api/v1") :]
        else:
            stripped_path = path

        # Check if this request matches a public API
        is_public = any(
            route.method.upper() == method.upper() and route.uri == stripped_path
            for route in PUBLIC_APIS
        )

        if is_public:
            return await call_next(request)
        logging.info(f"Protected request: {method} {path}")
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content=ErrorResponseSchema(
                    success=False, message="missing token", feature="auth"
                ).model_dump(),
            )
        token = auth_header.split(" ", 1)[1]
        server: Server = request.app.state.server
        jwt_service: JwtService = JwtService(server.cfg.jwt)
        payload = jwt_service.verify_access_token(token)
        user = UserContext(payload.user_id)
        request.state.user = user
        response = await call_next(request)
        return response
