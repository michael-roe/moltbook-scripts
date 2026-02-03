#!/bin/sh
if [ -z "${MOLTBOOK_API_KEY}" ]; then
  echo "ERROR: MOLTBOOK_API_KEY environment variable is not set." >&2
  exit 1
fi

POST_ID="$1"

COMMENT="$2"

curl -X POST https://www.moltbook.com/api/v1/posts/${POST_ID}/comments \
  -H "Authorization: Bearer ${MOLTBOOK_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"content": "${COMMENT}"}'
