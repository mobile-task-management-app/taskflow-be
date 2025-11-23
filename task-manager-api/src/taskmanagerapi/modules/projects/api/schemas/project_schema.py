from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProjectSchema(BaseModel):
    id: int = Field(description="id")
    name: str = Field(description="The official name of the project.", min_length=3)
    description: str = Field(
        description="A detailed summary of the project's purpose, scope, and goals.",
    )
    owner_id: int = Field(description="owner id")
    start_date: Optional[date] = Field(
        description="The optional planned or actual start date for the project."
    )
    end_date: Optional[date] = Field(
        description="The optional planned or actual completion date for the project.",
    )
    tag_ids: list[str] = Field(
        description="A list of string IDs used to categorize or label the project (e.g., ['backend', 'urgent']).",
    )
    created_at: datetime = Field(description="created at")
    updated_at: datetime = Field(description="updated at")

    model_config = {"from_attributes": True}
