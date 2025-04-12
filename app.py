from flask import Flask, render_template, request, jsonify
from time import time
from aiChatbot import PerplexityAIChatbot 

app = Flask(__name__)

model = PerplexityAIChatbot()

RATE_LIMIT = 5 # Number of requests allowed per user in the time window
WINDOW = 60

user_calls = {}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/location")
def location():
    return render_template("indextest.html")

@app.route("/safety_guide")
def safety_guide():
    return render_template("safety_guide.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")

@app.route("/report")
def report():
    return render_template("report.html")

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
