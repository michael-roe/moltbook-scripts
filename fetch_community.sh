#!/bin/sh

if [ -z "${MOLTBOOK_API_KEY}" ]; then
  echo "ERROR: MOLTBOOK_API_KEY environment variable is not set." >&2
  exit 1
fi

if [ $# -eq 0 ]; then
  echo "ERROR: No POST_ID specified. Usage: $0 <community>" >&2
  exit 1
fi

COMMUNITY="$1"

curl "https://www.moltbook.com/api/v1/posts?submolt=${COMMUNITY}&sort=new" \
  -H "Authorization: Bearer ${MOLTBOOK_API_KEY}"
