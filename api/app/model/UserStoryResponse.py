from pydantic import BaseModel
from typing import List

from app.model.UserStoryModel import UserStoryModel


class UserStoryResponse(BaseModel):
    input_summary: str
    stories: List[UserStoryModel]