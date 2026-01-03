# Vercel 部署步骤 - 修正版

## 错误原因

你看到的错误：
```
The specified name is already used for a different Git repository. 
Please enter a new one.
```

**原因：** 你选择了"创建新仓库"，但仓库名称 `universal-archive-extractor` 已经在 GitHub 上存在了。

**解决：** 应该选择"导入现有仓库"，而不是创建新仓库。

---

## 正确的操作步骤

### 第一步：回到 Vercel 首页

1. 如果还在错误页面，点击左上角的 **"←"** 返回
2. 或者直接访问：https://vercel.com/dashboard

---

### 第二步：选择"Import Git Repository"

1. 点击 **"Add New..."** 按钮
2. 选择 **"Project"**
3. 在页面顶部，你会看到两个选项：
   - ❌ **"Create Git Repository"**（创建新仓库）- **不要选这个**
   - ✅ **"Import Git Repository"**（导入现有仓库）- **选这个**

4. **点击 "Import Git Repository"**

---

### 第三步：选择你的 GitHub 仓库

1. 在仓库列表中，找到并点击：
   ```
   kexin0214444-cell/universal-archive-extractor
   ```
2. 如果看不到，点击 **"Configure GitHub App"** 授权访问你的仓库

---

### 第四步：配置项目

1. **Project Name**（项目名称）：
   - 可以保持默认：`universal-archive-extractor`
   - 或者改成你喜欢的名字

2. **Framework Preset**（框架预设）：
   - 选择 **"Other"** 或保持默认

3. **Root Directory**（根目录）：
   - 保持默认：`./`（项目根目录）

4. **Build Command**（构建命令）：
   - 保持默认或留空（Vercel 会自动检测）

5. **Output Directory**（输出目录）：
   - 保持默认或留空

6. **Install Command**（安装命令）：
   - 保持默认：`npm install`

---

### 第五步：部署

1. 点击底部的 **"Deploy"** 按钮
2. 等待部署完成（1-2分钟）
3. 部署成功后，你会看到：
   - ✅ "Congratulations! Your project has been deployed."
   - 一个网站地址，类似：`https://universal-archive-extractor.vercel.app`

---

## 关键区别

| 选项 | 用途 | 什么时候用 |
|------|------|-----------|
| **Import Git Repository** | 导入现有的 GitHub 仓库 | ✅ **你现在应该用这个** |
| **Create Git Repository** | 创建新的 Git 仓库 | ❌ 不要用（会报错，因为名字已存在） |

---

## 如果还是遇到问题

### 问题 1: 看不到你的仓库

**解决：**
1. 点击 **"Configure GitHub App"**
2. 授权 Vercel 访问你的 GitHub 账号
3. 选择要授权的仓库（或选择 "All repositories"）
4. 完成授权后，刷新页面

### 问题 2: 部署失败

**可能原因：**
- 项目配置不正确
- 缺少必要的文件

**解决：**
- 检查 `package.json` 是否存在
- 检查 `server.js` 是否存在
- 查看 Vercel 的错误日志

---

## 部署成功后的操作

1. **获得网站地址**：
   - 类似：`https://universal-archive-extractor.vercel.app`
   - 这个就是你的网站，可以分享给别人使用

2. **自动更新**：
   - 以后每次你在 GitHub Desktop 中推送代码
   - Vercel 会自动重新部署网站
   - 无需手动操作

3. **查看部署日志**：
   - 在 Vercel 项目页面可以查看部署历史
   - 可以查看错误日志和构建信息

---

## 总结

**关键点：**
- ✅ 选择 **"Import Git Repository"**（导入现有仓库）
- ❌ 不要选择 **"Create Git Repository"**（创建新仓库）

按照上面的步骤重新操作，应该就能成功部署了！

