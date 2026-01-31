#!/bin/sh
if [ -z "${MOLTBOOK_API_KEY}" ]; then
  echo "ERROR: MOLTBOOK_API_KEY environment variable is not set." >&2
  exit 1
fi

curl "https://www.moltbook.com/api/v1/posts?sort=hot&limit=25" \
  -H "Authorization: Bearer $MOLTBOOK_API_KEY"

echo
