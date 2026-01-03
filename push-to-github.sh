#!/bin/bash

echo "🚀 推送代码到 GitHub"
echo ""
echo "请按照以下步骤操作："
echo ""
echo "步骤 1: 在 GitHub 创建新仓库"
echo "----------------------------------------"
echo "1. 打开浏览器，访问: https://github.com"
echo "2. 登录你的 GitHub 账号"
echo "3. 点击右上角的 '+' 号，选择 'New repository'"
echo "4. 填写仓库信息："
echo "   - Repository name: universal-archive-extractor (或你喜欢的名字)"
echo "   - Description: 支持多种压缩格式的在线解压工具"
echo "   - 选择 Public 或 Private"
echo "   - ⚠️  不要勾选 'Initialize this repository with a README'"
echo "5. 点击 'Create repository'"
echo ""
echo "步骤 2: 获取仓库地址"
echo "----------------------------------------"
echo "创建仓库后，GitHub 会显示一个页面，上面有仓库地址"
echo "地址格式类似：https://github.com/你的用户名/仓库名.git"
echo ""
echo "步骤 3: 输入仓库地址"
echo "----------------------------------------"
read -p "请输入你的 GitHub 仓库地址（例如: https://github.com/username/repo.git）: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 错误: 仓库地址不能为空"
    exit 1
fi

echo ""
echo "正在添加远程仓库..."
git remote add origin "$REPO_URL" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  远程仓库已存在，尝试更新..."
    git remote set-url origin "$REPO_URL"
fi

echo "✅ 远程仓库已设置: $REPO_URL"
echo ""

echo "正在推送代码到 GitHub..."
echo "（如果是第一次推送，可能需要输入 GitHub 用户名和密码/Token）"
echo ""

git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功！代码已推送到 GitHub"
    echo ""
    echo "下一步："
    echo "1. 访问你的 GitHub 仓库页面查看代码"
    echo "2. 查看 DEPLOY.md 了解如何部署到云端"
    echo "3. 推荐使用 Vercel 部署（最简单）"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. 仓库地址不正确"
    echo "2. 需要身份验证（GitHub 现在需要使用 Personal Access Token）"
    echo ""
    echo "如果提示需要身份验证："
    echo "1. 访问: https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token' -> 'Generate new token (classic)'"
    echo "3. 设置权限: 勾选 'repo'"
    echo "4. 生成 Token 后，在输入密码时使用这个 Token"
    echo ""
    echo "或者使用 SSH（需要先配置 SSH key）"
fi

