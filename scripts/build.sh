#!/bin/bash
set -e

echo "🔧 Generating Prisma client with all binary targets..."
npx prisma generate

echo "📦 Building Next.js application..."
npx next build

echo "✅ Build completed successfully!" 