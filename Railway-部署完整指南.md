# Railway 部署完整指南 - 一步一步

## 🎯 为什么选择 Railway？

- ✅ **支持完整的 Node.js 环境**（不像 Vercel 的 Serverless）
- ✅ **支持大文件上传**（无 4.5MB 限制）
- ✅ **可以安装系统工具**（unrar, p7zip）
- ✅ **支持所有压缩格式**（ZIP, RAR, 7Z, TAR 等）
- ✅ **部署简单**（连接 GitHub 自动部署）
- ✅ **免费版足够使用**

---

## 📋 第一步：访问 Railway 并登录

1. **打开浏览器**，访问：https://railway.app

2. **点击右上角的 "Login" 或 "Start a New Project"**

3. **选择登录方式**：
   - 点击 **"Login with GitHub"**
   - 授权 Railway 访问你的 GitHub 账号
   - 选择要授权的仓库（或选择 "All repositories"）

4. **完成登录后**，你会看到 Railway Dashboard

---

## 📋 第二步：创建新项目

1. **在 Railway Dashboard 中**，点击 **"New Project"** 按钮

2. **选择部署方式**：
   - 点击 **"Deploy from GitHub repo"**
   - 或者点击 **"Deploy from GitHub"**

3. **选择你的仓库**：
   - 在仓库列表中找到：`universal-archive-extractor`
   - 点击仓库名称

4. **Railway 会自动开始部署**（等待 1-2 分钟）

---

## 📋 第三步：配置项目（如果需要）

Railway 通常会自动检测配置，但你可以检查：

1. **在项目页面**，点击 **"Settings"** 标签

2. **检查配置**：
   - **Build Command**: `npm install`（自动检测）
   - **Start Command**: `node server.js`（自动检测）
   - **Root Directory**: `./`（项目根目录）

3. **通常不需要修改**，Railway 会自动检测

---

## 📋 第四步：安装系统工具（可选，但推荐）

为了支持 RAR 和 7Z 格式，需要安装系统工具：

### 方法 1: 使用 Railway 的 Nixpacks（自动）

Railway 使用 Nixpacks，可以自动安装依赖。创建一个配置文件：

**文件已创建**：`railway.json`（我已经帮你创建了）

### 方法 2: 手动安装（如果自动安装失败）

1. **在 Railway 项目页面**，点击 **"Settings"**

2. **找到 "Service" 部分**，点击 **"Add Service"** → **"Empty Service"**

3. **在服务中运行命令**：
   ```bash
   apt-get update && apt-get install -y unrar p7zip-full
   ```

**注意**：Railway 使用 Ubuntu，所以使用 `apt-get`

---

## 📋 第五步：获取网站地址

1. **部署完成后**，在项目页面顶部，你会看到：

2. **点击 "Generate Domain"** 或查看已有的域名

3. **你会得到一个地址**，类似：
   ```
   https://universal-archive-extractor-production.up.railway.app
   ```
   或者：
   ```
   https://your-project-name.railway.app
   ```

4. **这个就是你的网站地址！** 🎉

---

## 📋 第六步：测试网站

1. **打开网站地址**

2. **测试功能**：
   - ✅ 上传 ZIP 文件
   - ✅ 上传 TAR 文件
   - ✅ 解压文件
   - ✅ 打包下载
   - ✅ 清理文件

---

## 🔧 如果遇到问题

### 问题 1: 部署失败

**解决**：
1. 查看 Railway 的部署日志
2. 检查是否有错误信息
3. 确保 `package.json` 存在
4. 确保 `server.js` 存在

### 问题 2: 网站无法访问

**解决**：
1. 检查服务是否正在运行
2. 查看日志是否有错误
3. 确保端口配置正确（Railway 会自动设置 PORT 环境变量）

### 问题 3: RAR/7Z 格式无法使用

**解决**：
1. 检查系统工具是否安装
2. 查看日志中的错误信息
3. 可能需要手动安装（见上面的方法 2）

---

## ✅ 部署成功后的功能

### 完全支持
- ✅ ZIP 格式
- ✅ TAR/GZ/TGZ 格式
- ✅ RAR 格式（如果安装了 unrar）
- ✅ 7Z 格式（如果安装了 p7zip）
- ✅ 大文件上传
- ✅ 所有功能

---

## 📝 总结

**Railway 部署步骤**：
1. ✅ 访问 railway.app 并登录
2. ✅ 创建新项目
3. ✅ 选择 GitHub 仓库
4. ✅ 等待自动部署
5. ✅ 获取网站地址

**优势**：
- 比 Vercel 更适合文件处理应用
- 支持所有功能
- 部署简单
- 免费版足够使用

---

## 🎉 完成！

部署成功后，你的网站就可以：
- ✅ 长期使用
- ✅ 支持所有压缩格式
- ✅ 支持大文件
- ✅ 分享给别人使用

祝你部署成功！

