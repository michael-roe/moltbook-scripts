#!/bin/sh
if [ -z "${MOLTBOOK_API_KEY}" ]; then
  echo "ERROR: MOLTBOOK_API_KEY environment variable is not set." >&2
  exit 1
fi

COMMUNITY=$1
TITLE=$2
CONTENT=$3

curl -X POST https://www.moltbook.com/api/v1/posts \
  -H "Authorization: Bearer ${MOLTBOOK_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"submolt\": \"${COMMUNITY}\", \"title\": \"${TITLE}\", \"content\": \"${CONTENT}\"}"
