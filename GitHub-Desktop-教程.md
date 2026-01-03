# GitHub Desktop 使用教程 - 一步一步指南

## 步骤 1: 下载并安装 GitHub Desktop

1. **打开浏览器**，访问：https://desktop.github.com
2. **点击 "Download for macOS"**（会自动检测你的系统）
3. **等待下载完成**
4. **打开下载的文件**（通常是 `GitHubDesktop.dmg`）
5. **将 GitHub Desktop 拖拽到 Applications 文件夹**
6. **打开 Applications 文件夹，双击 GitHub Desktop 启动**

---

## 步骤 2: 登录 GitHub 账号

1. **打开 GitHub Desktop** 后，会看到欢迎界面
2. **点击 "Sign in to GitHub.com"**
3. **在浏览器中登录**你的 GitHub 账号
   - 如果已经登录，会自动授权
   - 如果未登录，输入用户名和密码登录
4. **授权 GitHub Desktop 访问你的账号**
5. **回到 GitHub Desktop**，应该已经登录成功

---

## 步骤 3: 添加本地仓库

1. **在 GitHub Desktop 顶部菜单栏**，点击 **"File"** → **"Add Local Repository"**
   - 或者使用快捷键：`Cmd + O`
2. **点击 "Choose..." 按钮**
3. **导航到项目文件夹**：
   - 路径：`/Users/wangkexin/Desktop/Cursor code/Rar`
   - 或者直接在 Finder 中找到这个文件夹
4. **选择 "Rar" 文件夹**，点击 "Open"
5. **GitHub Desktop 会检测到这是一个 Git 仓库**，点击 "Add repository"

---

## 步骤 4: 查看仓库状态

添加成功后，你会看到：

- **左侧**：显示仓库名称 "Rar"
- **中间上方**：显示 "Current branch: main"
- **中间下方**：显示 "2 commits ahead of origin/main"
   - 这表示你有 2 个提交还没有推送到 GitHub
- **底部**：显示文件列表和更改

---

## 步骤 5: 推送代码到 GitHub

1. **在 GitHub Desktop 底部**，你会看到：
   - "2 commits ahead of origin/main"
   - 一个 **"Push origin"** 按钮
2. **点击 "Push origin" 按钮**
3. **等待推送完成**（可能需要几秒钟）
4. **推送成功后**，你会看到：
   - "This branch is up to date with origin/main"
   - 按钮变成灰色，显示 "No local changes"

---

## 步骤 6: 验证推送成功

1. **在 GitHub Desktop 中**，点击右上角的 **"View on GitHub"** 按钮
   - 或者直接访问：https://github.com/kexin0214444-cell/universal-archive-extractor
2. **在浏览器中打开你的 GitHub 仓库**
3. **你应该能看到所有文件**：
   - README.md
   - server.js
   - package.json
   - public/index.html
   - extractors/ 文件夹
   - 等等...

---

## 常见问题

### Q: 找不到 "Add Local Repository" 选项
**A**: 
- 确保点击的是顶部菜单栏的 "File"
- 或者使用快捷键 `Cmd + O`

### Q: 提示 "This directory does not appear to be a Git repository"
**A**: 
- 确保选择的是正确的文件夹（Rar 文件夹）
- 如果还是不行，在 GitHub Desktop 中点击 "File" → "New Repository"
  - Name: `universal-archive-extractor`
  - Local path: `/Users/wangkexin/Desktop/Cursor code/Rar`
  - 然后点击 "Create Repository"

### Q: 没有看到 "Push origin" 按钮
**A**: 
- 检查是否已经登录 GitHub 账号
- 检查仓库是否已经连接到远程仓库
- 如果看到 "Publish repository" 按钮，点击它（第一次推送时会显示这个）

### Q: 推送失败
**A**: 
- 检查网络连接
- 确保已经登录 GitHub 账号
- 尝试重新登录：GitHub Desktop → Preferences → Accounts

---

## 完成后的下一步

✅ **代码已经推送到 GitHub！**

现在你可以：
1. 在浏览器中查看你的仓库
2. 查看 [DEPLOY.md](./DEPLOY.md) 了解如何部署到云端
3. 推荐使用 **Vercel** 部署（最简单，免费）

---

## 截图说明

如果你需要更直观的指导，可以：
1. 打开 GitHub Desktop
2. 按照上面的步骤操作
3. 每一步都有清晰的界面提示

祝你成功！🎉

