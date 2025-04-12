# pip install requests
from dotenv import load_dotenv
load_dotenv()

import base64
import json
from openai import OpenAI
import os

 
client = OpenAI(
    api_key= os.getenv("UPSTAGE_API_KEY"),
    base_url="https://api.upstage.ai/v1/information-extraction"
)

FILE_PATH="250412 국민안전관리 일일상황(06시)_최종.pdf"
with open("Schema_Daily_Report.json", "r") as schema_file:
    schema = json.load(schema_file)
MIME_TYPE="application/pdf"
 
def encode_to_base64(file_path):
    with open(file_path, 'rb') as f:
        file_bytes = f.read()
        base64_encoded = base64.b64encode(file_bytes).decode('utf-8')
        return base64_encoded
    
base64_encoded = encode_to_base64(FILE_PATH)

extraction_client = OpenAI(
    api_key= os.getenv("UPSTAGE_API_KEY"),
    base_url="https://api.upstage.ai/v1/information-extraction"
)
 
extraction_response = extraction_client.chat.completions.create(
    model="information-extract",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{MIME_TYPE};base64,{base64_encoded}"},
                }
            ]
        }
    ],
    response_format=schema,
)

print("Information Extraction Response:")
print(json.loads(extraction_response.choices[0].message.content))