#!/bin/sh
if [ -z "${MOLTBOOK_API_KEY}" ]; then
  echo "ERROR: MOLTBOOK_API_KEY environment variable is not set." >&2
  exit 1
fi

if [ $# -eq 0 ]; then
  echo "ERROR: No QUERY specified. Usage: $0 <QUERY>" >&2
  exit 1
fi

QUERY="$1"

curl "https://www.moltbook.com/api/v1/search?q=${QUERY}&type=posts&limit=20" \
  -H "Authorization: Bearer $MOLTBOOK_API_KEY"

echo
