import os
import asyncio
from agents import Agent, Runner, set_default_openai_api, set_tracing_disabled
from dotenv import load_dotenv

load_dotenv()


async def main():
    print("Hello from USER STORY WRITER!")
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
        """
    )
    
    user_input = (
        "I need help writing user stories for my Agile project: "
        "Automated agent to detect fraudulent transactions in "
        "real-time."
    )
    result = Runner.run_streamed(agent, input=user_input, max_turns=2)
    async for event in result.stream_events():
        if (event.type == "raw_response_event" and
                event.data.type == "response.output_text.delta"):
            print(event.data.delta, end="", flush=True)
    print("Agent run result:", result)
    
    # result = await Runner.run(agent, input="Give me 3 bullet tips to learn 
    #                           Agents SDK.")
    # print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
