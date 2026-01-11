from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import date

from app.model.AcceptanceCriteriaModel import AcceptanceCriteriaModel


class UserStoryModel(BaseModel):
    story_id: str
    title: str
    as_a: str
    i_want: str
    so_that: str

    description: Optional[str] = None
    business_value: Optional[str] = None

    priority: str = "Medium"
    story_points: Optional[int] = None
    status: str = Field(default="To Do")

    acceptance_criteria: List[AcceptanceCriteriaModel] = Field(
        default_factory=list
    )
    tasks: List[str] = Field(default_factory=list)
    dependencies: List[str] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)

    created_by: Optional[str] = None
    created_on: date = Field(default_factory=date.today)

    labels: List[str] = Field(default_factory=list)
    metadata: Dict[str, str] = Field(default_factory=dict)