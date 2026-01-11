from asyncio.log import logger
from uuid import uuid4
from app.model.RequirementsInput import RequirementsInput
from app.model.UserStoryResponse import UserStoryResponse
import os
from agents import Agent, Runner, set_default_openai_api, set_tracing_disabled, AgentOutputSchema
from dotenv import load_dotenv


async def generate_user_stories(req: RequirementsInput) -> UserStoryResponse:
    load_dotenv()
    logger.info(
        f"Generating user stories for requirements: "
        f"{req.requirements_text[:100]}"
    )
    
    os.environ["OPENAI_BASE_URL"] = os.getenv("DOCKER_AI_API_URL",
                                              "http://localhost:12434/engines/v1")
    os.environ["OPENAI_API_KEY"] = os.getenv("DOCKER_AI_API_KEY",
                                             "docker")
    os.environ["OPENAI_DEFAULT_MODEL"] = os.getenv("DOCKER_AI_MODEL",
                                                   "ai/gpt-oss")
    
    # os.environ["OPENAI_BASE_URL"] = os.getenv("LMSTUDIO_API_URL",
    #                                           "http://127.0.0.1:1234/v1")
    # os.environ["OPENAI_API_KEY"] = os.getenv("LMSTUDIO_API_KEY",
    #                                           "lm-studio")
    # os.environ["OPENAI_DEFAULT_MODEL"] = os.getenv("LMSTUDIO_MODEL",
    #                                               "openai/gpt-oss-20b")
    
    set_default_openai_api("chat_completions")
    set_tracing_disabled(True)
    agent = Agent(
        name="Agile and Scrum Expert Product owner expert in "
             "User Story Writing",
        instructions=""" Agile and Scrum Expert Product owner expert
        in User Story Writing.
        You are an expert in Agile methodologies and Scrum
        framework, specializing in writing clear and concise user
        stories.
        Your task is to help teams create effective user stories
        that capture the needs and requirements of end-users.
        When writing user stories, ensure they follow the INVEST
        criteria (Independent, Negotiable, Valuable, Estimable,
        Small, Testable).
        Provide examples and best practices for writing user
        stories that facilitate collaboration and understanding
        among team members.
        Always prioritize the user's perspective and focus on
        delivering value through well-defined user stories.
        """,
        output_type=AgentOutputSchema(UserStoryResponse, strict_json_schema=False),
    )
    
    user_input = (
        f"I need help writing user stories for my Agile project: Strictly only {req.max_stories} user stories. "
        f"{req.requirements_text}"
    )
    
    result = await Runner.run(agent, input=user_input)
    user_story_response = result.final_output
    logger.info(user_story_response)

    # # Ensure IDs are strings; add fallback UUIDs if needed
    # for s in user_story_response.stories:
    #     s.setdefault("story_id", f"US-{uuid4().hex[:6]}")

    return UserStoryResponse(
        input_summary=req.requirements_text,
        stories=user_story_response.stories,
    )