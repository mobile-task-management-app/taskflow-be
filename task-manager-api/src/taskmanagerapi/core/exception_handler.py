from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from taskmanagerapi.core.exceptions.app_exception import AppException
from taskmanagerapi.core.schemas.error_response_schema import ErrorResponseSchema


async def base_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=ErrorResponseSchema(
            success=False, message="internal error", feature="internal"
        ).model_dump(),
    )


async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status,
        content=ErrorResponseSchema(
            success=False, message=exc.message, feature=exc.feature
        ).model_dump(),
    )


async def pydantic_validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Handles RequestValidationError (Pydantic validation errors) and returns a
    standardized 422 Unprocessable Entity response using ErrorResponseSchema.
    """

    # Extract detailed errors from Pydantic
    errors = exc.errors()
    formatted_errors: list[str] = []

    # Iterate through errors and format them for a human-readable message
    for error in errors:
        # 'loc' contains the location of the error, e.g., ('body', 'username')
        field_name = error["loc"][-1] if len(error["loc"]) > 1 else "general"
        error_message = error["msg"]

        formatted_errors.append(f"Field '{field_name}': {error_message}")

    # Join all error messages into a single string
    full_message = "Validation Failed: " + " | ".join(formatted_errors)

    # Use the ErrorResponseSchema to create the standardized response content
    response_content = ErrorResponseSchema(
        success=False, message=full_message, feature="common"
    ).model_dump()

    return JSONResponse(
        status_code=400,
        content=response_content,
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponseSchema(
            success=False, message=exc.detail, feature="https"
        ).model_dump(),
    )
