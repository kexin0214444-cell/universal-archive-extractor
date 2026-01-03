# GitHub 部署指南

## 步骤 1: 在 GitHub 创建新仓库

1. 访问 https://github.com
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `universal-archive-extractor`（或你喜欢的名字）
   - **Description**: `支持多种压缩格式的在线解压工具`
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（我们已经有了）
4. 点击 "Create repository"

## 步骤 2: 连接本地仓库到 GitHub

在项目目录下运行以下命令（将 `YOUR_USERNAME` 替换为你的 GitHub 用户名）：

```bash
cd "/Users/wangkexin/Desktop/Cursor code/Rar"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/universal-archive-extractor.git

# 或者使用 SSH（如果你配置了 SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/universal-archive-extractor.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

## 步骤 3: 验证推送

访问你的 GitHub 仓库页面，应该能看到所有文件已经上传。

## 步骤 4: 部署到云端

### 选项 A: Vercel（最简单）

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的仓库 `universal-archive-extractor`
5. Vercel 会自动检测 `vercel.json` 配置
6. 点击 "Deploy"
7. 等待部署完成，你会得到一个 URL（如 `https://your-project.vercel.app`）

### 选项 B: Railway

1. 访问 https://railway.app
2. 使用 GitHub 账号登录
3. 点击 "New Project" -> "Deploy from GitHub repo"
4. 选择你的仓库
5. Railway 会自动部署

### 选项 C: Render

1. 访问 https://render.com
2. 使用 GitHub 账号登录
3. 点击 "New" -> "Web Service"
4. 连接你的 GitHub 仓库
5. 配置：
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. 点击 "Create Web Service"

## 注意事项

1. **文件大小限制**：
   - Vercel 免费版：100MB
   - Railway 免费版：有使用限制
   - Render 免费版：会休眠

2. **系统工具**：
   - 某些平台可能不支持安装系统工具（unrar, p7zip）
   - 这些平台只能使用 ZIP 和 TAR 格式
   - 项目已包含 unrar 二进制文件，但某些平台可能无法执行

3. **持久化存储**：
   - 云平台的临时文件会在重启后清空
   - 如果需要持久化，考虑使用云存储服务

## 更新代码

如果以后修改了代码，推送更新：

```bash
git add .
git commit -m "更新说明"
git push
```

部署平台会自动检测更新并重新部署。

## 获取帮助

如果遇到问题：
1. 查看 [DEPLOY.md](./DEPLOY.md) 获取详细部署说明
2. 查看平台的官方文档
3. 在 GitHub 仓库创建 Issue

