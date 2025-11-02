from pydantic import BaseModel, Field


class ErrorResponseSchema(BaseModel):
    success: bool = Field(
        False, description="Indicates that the operation was not successful"
    )
    message: str = Field(..., description="Descriptive error message")
    feature: str = Field(
        None, description="Optional feature or module where the error occurred"
    )
