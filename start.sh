#!/bin/bash

echo "🚀 启动通用压缩包解压工具..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

# 检查系统工具（可选）
echo "🔍 检查系统工具..."
if ! command -v unrar &> /dev/null; then
    echo "⚠️  未安装 unrar (RAR 格式需要，可选)"
    echo "   macOS: brew install unrar"
    echo "   Linux: sudo apt-get install unrar"
else
    echo "✅ unrar 已安装"
fi

if ! command -v 7z &> /dev/null && ! command -v 7za &> /dev/null; then
    echo "⚠️  未安装 7z (7Z 格式需要，可选)"
    echo "   macOS: brew install p7zip"
    echo "   Linux: sudo apt-get install p7zip-full"
else
    echo "✅ 7z 已安装"
fi

echo ""
echo "✅ ZIP 和 TAR 格式已可用（无需额外工具）"
echo ""
echo "🌐 服务器启动中..."
echo "📝 访问地址: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

node server.js

