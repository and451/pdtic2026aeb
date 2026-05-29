#!/bin/sh
set -e

pnpm -w run typecheck:libs
pnpm --filter @workspace/pdtic-moscow run build

mkdir -p .vercel/output/static
cp -r artifacts/pdtic-moscow/dist/. .vercel/output/static/

cat > .vercel/output/config.json << 'EOF'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
EOF
