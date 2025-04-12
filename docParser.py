# pip install requests
from dotenv import load_dotenv
load_dotenv()

import requests
 
api_key = "up_5BbYAxfmTGssi5aGil6mVpH9avaZo"
filename = "250411 중대본 일일상황보고 34보(09시)-외부용.pdf"  # ex: ./image.png
 
url = "https://api.upstage.ai/v1/document-digitization"
headers = {"Authorization": f"Bearer {api_key}"}
files = {"document": open(filename, "rb")}
data = {"ocr": "force", "base64_encoding": "['table']", "model": "document-parse"}
response = requests.post(url, headers=headers, files=files, data=data)
 
print(response.json())