from openai import OpenAI
from dotenv import load_dotenv

import os
load_dotenv()

client = OpenAI(
    api_key = os.getenv("PERPLEXITY_API_KEY"),
    base_url="https://api.perplexity.ai"
)

class PerplexityAIChatbot:
    def __init__(self):
        self.client = client

    def chat(self, user_message):
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a friendly and calm disaster emergency response assistant. Your main users are elderly people and foreigners, so always use simple and clear words. Your job is to guide users step by step during emergency situations like earthquakes, fires, floods, or other disasters. "
                    "Start every conversation by telling them to stay calm. Ask clear questions one by one. Do not give too many instructions at once. Based on the user's answers, guide them with short steps. If you do not understand something, ask them to repeat it using simple words. "
                    "Important behavior: Use very simple English, avoid hard words. Always be calm, polite, and comforting. Ask one question at a time. Use short sentences and line breaks for readability. Give safety advice step by step. If the situation is dangerous, prioritize calling for help or moving to a safe place."
                    "Wait for their response before continuing to the next step. "
                    "If needed, offer to contact emergency services or show the nearest safe shelter using location data."
                ),
            },
            {
                "role": "user",
                "content": user_message + "please limit the response to 100 words and only pure text, no code blocks or markdowns",
            },
        ]

        try:
            response = self.client.chat.completions.create(
                model="sonar-pro",
                messages=messages,
            )
            return response.choices[0].message.content
        except Exception as e:
            return str(e)