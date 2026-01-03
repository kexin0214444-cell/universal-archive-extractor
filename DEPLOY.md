# 部署指南

本项目可以部署到多个平台，让网站长期可用。以下是推荐的部署方式：

## 方式一：Vercel（推荐，免费且简单）

### 步骤：

1. **Fork 或 Clone 本项目到你的 GitHub**

2. **安装 Vercel CLI**（可选，也可以直接在网页操作）
   ```bash
   npm i -g vercel
   ```

3. **在项目根目录创建 `vercel.json`**：
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

4. **部署到 Vercel**：
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - Vercel 会自动检测配置并部署

### 注意事项：
- Vercel 免费版有文件大小限制（100MB），大文件可能无法上传
- 需要安装系统工具（unrar, p7zip）的话，可能需要使用 Docker

## 方式二：Railway（推荐，支持大文件）

### 步骤：

1. **Fork 或 Clone 本项目到你的 GitHub**

2. **访问 Railway**：
   - 访问 https://railway.app
   - 使用 GitHub 账号登录
   - 点击 "New Project" -> "Deploy from GitHub repo"
   - 选择你的仓库

3. **配置环境变量**（可选）：
   - `PORT`: 端口号（Railway 会自动设置）

4. **Railway 会自动部署**

### 注意事项：
- Railway 免费版每月有使用限制
- 支持大文件上传
- 可以安装系统依赖

## 方式三：Render（免费，适合长期运行）

### 步骤：

1. **Fork 或 Clone 本项目到你的 GitHub**

2. **访问 Render**：
   - 访问 https://render.com
   - 使用 GitHub 账号登录
   - 点击 "New" -> "Web Service"
   - 连接你的 GitHub 仓库

3. **配置**：
   - **Name**: 你的服务名称
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. **点击 "Create Web Service"**

### 注意事项：
- Render 免费版在 15 分钟无活动后会休眠
- 首次访问可能需要等待几秒唤醒服务

## 方式四：Heroku（需要信用卡验证）

### 步骤：

1. **创建 `Procfile`**：
   ```
   web: node server.js
   ```

2. **在 Heroku 创建应用并部署**

## 方式五：自建服务器（VPS）

### 步骤：

1. **在服务器上安装 Node.js**：
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **安装系统工具**：
   ```bash
   sudo apt-get update
   sudo apt-get install unrar p7zip-full
   ```

3. **Clone 项目**：
   ```bash
   git clone <你的仓库地址>
   cd Rar
   npm install
   ```

4. **使用 PM2 运行**（推荐）：
   ```bash
   npm install -g pm2
   pm2 start server.js --name archive-extractor
   pm2 save
   pm2 startup
   ```

5. **配置 Nginx 反向代理**（可选）：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 环境变量

如果需要自定义端口，可以设置环境变量：
```bash
PORT=3000
```

## 注意事项

1. **文件存储**：部署到云平台时，`uploads/` 和 `extracted/` 目录是临时的，重启后会清空。如果需要持久化，考虑使用云存储服务。

2. **系统工具**：RAR 和 7Z 格式需要系统安装 `unrar` 和 `p7zip`。某些平台可能不支持，只能使用 ZIP 和 TAR 格式。

3. **文件大小限制**：不同平台有不同的文件大小限制，请查看平台文档。

4. **安全性**：生产环境建议添加：
   - 文件类型验证
   - 文件大小限制
   - 身份验证
   - 速率限制

## 推荐配置

对于长期可用的服务，推荐：
- **Vercel**：适合小文件，部署简单
- **Railway**：适合大文件，功能完整
- **Render**：免费，但会休眠
- **自建 VPS**：完全控制，适合大文件和高并发

