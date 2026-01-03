#!/bin/bash

echo "🚀 自动安装 unrar 工具"
echo ""

# 检查是否已安装
if command -v unrar &> /dev/null; then
    echo "✅ unrar 已经安装"
    unrar | head -1
    exit 0
fi

# 检查是否有 Homebrew
if ! command -v brew &> /dev/null; then
    echo "📦 未检测到 Homebrew，正在安装..."
    echo "   这可能需要几分钟时间，请耐心等待..."
    echo ""
    
    # 安装 Homebrew
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Homebrew 安装失败"
        echo "   请手动运行：/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # 添加 Homebrew 到 PATH（如果是 Apple Silicon Mac）
    if [ -f /opt/homebrew/bin/brew ]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -f /usr/local/bin/brew ]; then
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    
    echo "✅ Homebrew 安装成功"
    echo ""
fi

# 安装 unrar
echo "📦 正在安装 unrar..."
brew install unrar

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ unrar 安装成功！"
    echo ""
    unrar | head -1
    echo ""
    echo "现在可以解压 RAR 文件了！"
else
    echo ""
    echo "❌ unrar 安装失败"
    echo "   请尝试手动安装：brew install unrar"
    exit 1
fi

