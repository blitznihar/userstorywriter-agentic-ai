from fastapi import APIRouter

from app.model import RequirementsInput, UserStoryResponse
from app.service.userstorylogic import generate_user_stories

router = APIRouter()


@router.get("/hello")
def hello(name: str = "world"):
    return {"message": f"hello, {name}"}


@router.post("/user-stories/generate", response_model=UserStoryResponse)
async def generate(req: RequirementsInput):
    return await generate_user_stories(req)