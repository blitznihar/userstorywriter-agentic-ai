from pydantic import BaseModel


class AcceptanceCriteriaModel(BaseModel):
    id: str
    description: str
    priority: str = "Must"