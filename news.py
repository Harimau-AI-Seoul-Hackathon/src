import requests
import os
import json
import time
from newsapi import NewsApiClient
from dotenv import load_dotenv

load_dotenv()

CACHE_FILE = 'news_data.json'
CACHE_DURATION = 24 * 60 * 60 # 24 hours in seconds

with open('output_schema.json', 'r', encoding='utf-8') as f:
    output_schema = json.load(f)

class NewsFetcher:
    def __init__(self):
        self.newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_KEY"))
        self.perplexity_api_key = os.getenv("PERPLEXITY_API_KEY")
        self.perplexity_url = "https://api.perplexity.ai/chat/completions"

    def fetch_news(self):
        """Fetch news articles from NewsAPI."""
        articles = self.newsapi.get_everything(
            q='지진 OR 홍수 OR 태풍 OR 산불',
            from_param='2025-04-05',
            sort_by='publishedAt',
            page_size=5
        )['articles']
        return articles

    def process_articles(self, articles):
        """Process articles into a format for the prompt."""
        article_texts = []
        for a in articles:
            published = a['publishedAt'][:10]
            title = a['title']
            desc = a.get('description', '')
            article_texts.append(f"- [{published}] {title}. {desc}")
        return article_texts

    def generate_prompt(self, article_texts):
        """Generate the prompt for Perplexity API."""
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
        return prompt

    def fetch_perplexity_response(self, prompt):
        """Send the prompt to Perplexity API and get the response."""
        headers = {
            "Authorization": f"Bearer {self.perplexity_api_key}",
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
                    "schema": output_schema,
                }
            },
            "max_tokens": 500,
            "temperature": 0.1,
            "stream": False
        }

        response = requests.post(self.perplexity_url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        return json.loads(result['choices'][0]['message']['content'])

    def get_news_data(self):
        """Fetch and process news data, with file caching."""
        # Check if cache exists and is still valid.
        if os.path.exists(CACHE_FILE):
            cache_mtime = os.path.getmtime(CACHE_FILE)
            if time.time() - cache_mtime < CACHE_DURATION:
                # Use the cached data
                with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
        
        # Otherwise, fetch fresh data from the APIs.
        with open('output_schema.json', 'r', encoding='utf-8') as f:
            output_schema = json.load(f)

        articles = self.fetch_news()
        article_texts = self.process_articles(articles)
        prompt = self.generate_prompt(article_texts)
        data = self.fetch_perplexity_response(prompt, output_schema)

        # Save to cache file
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return data
