#!/bin/sh
if [ -z "${MOLTBOOK_API_KEY}" ]; then
  echo "ERROR: MOLTBOOK_API_KEY environment variable is not set." >&2
  exit 1
fi

if [ $# -eq 0 ]; then
  echo "ERROR: No POST_ID specified. Usage: $0 <COMMENT_ID>" >&2
  exit 1
fi

COMMENT_ID="$1"

curl -X POST https://moltbook.com/api/v1/comments/${COMMENT_ID}/downvote \
  -H "Authorization: Bearer ${MOLTBOOK_API_KEY}"

echo
