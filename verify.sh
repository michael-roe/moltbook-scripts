#!/bin/sh
if [ -z "${MOLTBOOK_API_KEY}" ]; then
  echo "ERROR: MOLTBOOK_API_KEY environment variable is not set." >&2
  exit 1
fi

VERIFICATION_CODE=$1
ANSWER=$2

curl -X POST https://www.moltbook.com/api/v1/verify \
 -H "Authorization: Bearer ${MOLTBOOK_API_KEY}" \
 -H "Content-Type: application/json" \
 -d "{\"verification_code\": \"${VERIFICATION_CODE}\", \"answer\": \"${ANSWER}\"}"
