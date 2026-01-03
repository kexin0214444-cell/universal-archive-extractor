# Vercel 部署错误修复

## 错误信息

```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
This Serverless Function has crashed.
```

## 问题原因

Vercel 的 Serverless Functions 环境与本地 Node.js 环境不同：
1. **不需要监听端口**：Vercel 会自动处理请求
2. **需要导出 app**：必须使用 `module.exports = app`
3. **文件系统限制**：临时文件可能无法持久化

## 已修复的问题

### 1. 修改了 `server.js`

- ✅ 添加了条件判断：本地开发时监听端口，Vercel 部署时导出 app
- ✅ 添加了 `module.exports = app` 供 Vercel 使用

### 2. 更新了 `vercel.json`

- ✅ 修复了路由路径（添加了前导斜杠）
- ✅ 添加了函数超时配置（60秒）

## 重新部署步骤

### 方法一：在 GitHub Desktop 中推送更新

1. **在 GitHub Desktop 中**：
   - 你会看到有文件更改（server.js 和 vercel.json）
   - 在 "Summary" 输入：`修复 Vercel 部署错误`
   - 点击 "Commit to main"
   - 点击 "Push origin"

2. **Vercel 会自动重新部署**：
   - 等待 1-2 分钟
   - 刷新你的网站页面

### 方法二：在 Vercel 中重新部署

1. **访问 Vercel Dashboard**：
   - https://vercel.com/dashboard
   - 找到你的项目

2. **点击 "Redeploy"** 或等待自动部署

## 注意事项

### Vercel 的限制

1. **文件大小限制**：
   - 免费版：4.5MB 请求体限制
   - 大文件可能无法上传

2. **系统工具限制**：
   - Vercel 不支持安装系统工具（unrar, p7zip）
   - **只能使用 ZIP 和 TAR 格式**

3. **临时文件**：
   - 文件存储在 `/tmp` 目录（临时）
   - 每次请求后可能被清理

### 如果还是有问题

**推荐使用 Railway**（更适合这个项目）：

1. **访问**：https://railway.app
2. **使用 GitHub 登录**
3. **选择 "Deploy from GitHub repo"**
4. **选择你的仓库**
5. **Railway 支持**：
   - ✅ 大文件上传
   - ✅ 系统工具安装
   - ✅ 所有压缩格式

## 测试

修复后，访问你的网站：
- 应该能看到上传界面
- 可以上传 ZIP 和 TAR 文件
- RAR 和 7Z 格式可能无法使用（Vercel 限制）

## 总结

- ✅ 已修复 server.js 导出问题
- ✅ 已更新 vercel.json 配置
- ✅ 需要重新部署才能生效

**下一步：在 GitHub Desktop 中提交并推送更改，Vercel 会自动重新部署。**

