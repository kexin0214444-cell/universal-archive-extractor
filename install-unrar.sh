#!/bin/bash

echo "🔧 安装 unrar 工具..."
echo ""

# 检查是否已安装
if command -v unrar &> /dev/null; then
    echo "✅ unrar 已经安装"
    unrar | head -1
    exit 0
fi

# 检查是否有 Homebrew
if command -v brew &> /dev/null; then
    echo "📦 检测到 Homebrew，使用 Homebrew 安装..."
    brew install unrar
    if [ $? -eq 0 ]; then
        echo "✅ unrar 安装成功！"
        exit 0
    else
        echo "❌ Homebrew 安装失败，尝试手动安装..."
    fi
fi

# 手动安装指南
echo ""
echo "⚠️  未检测到 Homebrew，请选择以下方式之一安装："
echo ""
echo "方法一：安装 Homebrew 后安装 unrar"
echo "  1. 安装 Homebrew："
echo "     /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
echo "  2. 安装 unrar："
echo "     brew install unrar"
echo ""
echo "方法二：手动下载安装"
echo "  1. 访问 https://www.rarlab.com/download.htm"
echo "  2. 下载 macOS 版本的 RAR 工具（rarosx-*.tar.gz）"
echo "  3. 解压并安装："
echo "     cd ~/Downloads"
echo "     tar -xvf rarosx-*.tar.gz"
echo "     cd rar"
echo "     sudo install -c -o \$USER unrar /usr/local/bin/"
echo ""
echo "安装完成后，请重新运行此脚本验证安装。"
echo ""

