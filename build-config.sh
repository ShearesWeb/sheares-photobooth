#!/usr/bin/env bash
# Generate config.js from .env (local dev) or environment (CI).
set -euo pipefail

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${SUPABASE_URL:?SUPABASE_URL not set}"
: "${SUPABASE_ANON_KEY:?SUPABASE_ANON_KEY not set}"
: "${SUPABASE_BUCKET:?SUPABASE_BUCKET not set}"

cat > config.js <<EOF
window.APP_CONFIG = {
  SUPABASE_URL: '${SUPABASE_URL}',
  SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY}',
  SUPABASE_BUCKET: '${SUPABASE_BUCKET}',
};
EOF

echo "Wrote config.js"
