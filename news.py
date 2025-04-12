import requests
import os
import json
from newsapi import NewsApiClient
from dotenv import load_dotenv

load_dotenv()

# Initialize NewsAPI client
newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_KEY"))
articles = newsapi.get_everything(
    q='지진 OR 홍수 OR 태풍 OR 산불',
    from_param='2025-04-05',
    sort_by='publishedAt',
    page_size= 5
)['articles']

print(f"Received {len(articles)} articles from NewsAPI")  # Should show 5

# Build the prompt
article_texts = []
for a in articles:
    published = a['publishedAt'][:10]
    title = a['title']
    desc = a.get('description', '')
    article_texts.append(f"- [{published}] {title}. {desc}")

prompt = (
    "Here are 5 recent Korean natural disaster news items:\n"
    + "\n".join(article_texts)
    + "\n\n"
    "For EACH item, provide:\n"
    "1. One-sentence summary\n"
    "2. Category (지진/홍수/태풍/산불)\n"
    "3. Location\n"
    "4. Original date\n"
    "Return as JSON array with all 5 entries in English."
)

# Define the output schema
with open('output_schema.json', 'r', encoding='utf-8') as f:
    output_schema = json.load(f)

# Set up the API request
api_key = os.getenv("PERPLEXITY_API_KEY")
url = "https://api.perplexity.ai/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "sonar-pro",
    "messages": [
        {"role": "system", "content": "You are a concise categorizer."},
        {"role": "user", "content": prompt}
    ],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": output_schema
        }
    },
    "max_tokens": 500,
    "temperature": 0.1,
    "stream": False
}

# Send the request
response = requests.post(url, headers=headers, json=payload)
response.raise_for_status()
result = response.json()

# Extract and print the data
data = json.loads(result['choices'][0]['message']['content'])
print(data)
