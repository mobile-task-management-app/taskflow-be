from pydantic import BaseModel, Field


class AppResponseSchema[T](BaseModel):
    success: bool = Field(
        ..., description="Indicates whether the operation was successful"
    )
    message: str = Field(..., description="Descriptive message about the response")
    data: T = Field(
        None, description="Optional data payload returned with the response"
    )
