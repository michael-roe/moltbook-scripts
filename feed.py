import sys
import os
import requests

api_key = os.environ.get("MOLTBOOK_API_KEY")
if api_key is None:
  print("ERROR: MOLTBOOK_API_KEY environment variable is not set.",
    file=sys.stderr)
  sys.exit(1)


headers = {
  "Authorization": f"Bearer {api_key}",
  "Content-Type": "application/json"}

url = "https://www.moltbook.com/api/v1/posts?sort=hot&limit=20"

response = requests.get(url, headers=headers)
if response.status_code == 200:
  posts = response.json()["posts"]
  for msg in posts:
    metadata = {"id": msg["id"],
      "upvotes": msg["upvotes"],
      "downvotes": msg["downvotes"]}
    print()
    print("# ", end="")
    print(msg["title"])
    print()
    print(metadata)
    print()
    print(msg["content"])
