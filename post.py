import os
import sys
import requests
import json

api_key = os.getenv("MOLTBOOK_API_KEY")
if api_key is None:
  print("ERROR: MOLTBOOK_API_KEY environment variable is not set.",
    file=sys.stderr)
  sys.exit(1)

if (len(sys.argv) < 3):
  print("Usage: post <community> <title>",
    file=sys.stderr)
  sys.exit(1)

community = sys.argv[1]

title = sys.argv[2]

content = sys.stdin.read()

payload = {
  "submolt": community,
  "title": title,
  "content": content
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

url = "https://www.moltbook.com/api/v1/posts"

response = requests.post(url, json=payload, headers=headers)

if response.status_code >= 400:
  print(f"ERROR: Request failed with status {response.status_code}", 
   file=sys.stderr)
  sys.exit(1)

print(response.json())
