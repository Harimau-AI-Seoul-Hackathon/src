from flask import Flask, render_template, request, jsonify
from time import time
from aiChatbot import PerplexityAIChatbot 
from news import NewsFetcher

app = Flask(__name__)

model = PerplexityAIChatbot()
news_fetcher = NewsFetcher()

DISASTER_API_KEY = 'your_disaster_api_key'
DISASTER_API_URL = 'https://api.safetydata.go.kr/openapi/service/rest/DisasterMsg2/getDisasterMsgList'

#PERPLEXITY_API_KEY=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
#UPSTAGE_API_KEY=up_LQPEk4u7eRVceg4D3D6YfrUxU4X6W
#NEWSAPI_KEY=a1949a55a1194792bce313981c4aaaaa

RATE_LIMIT = 5 # Number of requests allowed per user in the time window
WINDOW = 60

user_calls = {}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/safety_guide")
def safety_guide():
    return render_template("safety_guide.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")

@app.route("/chat", methods=["POST"])
def chat():

    user_ip = request.remote_addr
    now = time()
    user_calls.setdefault(user_ip, [])

    # Remove timestamps outside the time window
    user_calls[user_ip] = [t for t in user_calls[user_ip] if now - t < WINDOW]

    if len(user_calls[user_ip]) >= RATE_LIMIT:
        return jsonify({"error": "Rate limit exceeded. Try again later."}), 429

    user_calls[user_ip].append(now)

    user_message = request.json.get("message")
    response = model.chat(user_message)
    return jsonify({"response": response})

@app.route('/disaster_summary')
def disaster_summary():
    data = news_fetcher.get_news_data()
    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
