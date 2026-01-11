from pydantic import BaseModel, Field
from typing import Optional


class RequirementsInput(BaseModel):
    requirements_text: str = Field(
        ..., min_length=10, description="Raw requirements / notes"
    )
    product: Optional[str] = "Product"
    primary_user: Optional[str] = "User"
    priority: Optional[str] = "Medium"
    max_stories: int = Field(default=3, ge=1, le=10)