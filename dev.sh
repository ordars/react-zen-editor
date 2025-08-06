#!/bin/bash

# React Zen Editor - Next.js Development Server Starter
# 루트 디렉토리에서 실행하는 개발 서버

echo "🧘 React Zen Editor - Next.js Development Server"
echo "================================================"
echo ""
echo "📂 Project Root: $(pwd)"
echo "🎯 Target Directory: nextjs-test/"
echo "📋 Starting Next.js development server..."
echo ""

# nextjs-test 디렉토리로 이동 후 개발 서버 실행
cd nextjs-test

# 디렉토리 변경 성공 확인
if [ $? -ne 0 ]; then
    echo "❌ Error: nextjs-test directory not found!"
    echo "💡 Make sure you're running this script from the project root directory."
    exit 1
fi

echo "📂 Working Directory: $(pwd)"
echo ""

# Next.js 개발 서버 실행 (Turbopack 없이)
./node_modules/.bin/next dev

echo ""
echo "👋 Server stopped."