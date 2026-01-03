# 通用压缩包解压工具

一个支持多种压缩格式的在线解压工具，支持 ZIP、RAR、7Z、TAR、GZ 等常见格式，无文件大小限制。

## 功能特点

- ✅ 支持多种压缩格式：ZIP、RAR、7Z、TAR、GZ、TGZ、BZ2、XZ
- ✅ 无文件大小限制
- ✅ 拖拽上传，操作简便
- ✅ 实时上传进度显示
- ✅ 解压后文件列表展示
- ✅ 支持单个文件下载
- ✅ 现代化 UI 设计

## 安装步骤

### 1. 安装 Node.js 依赖

```bash
npm install
```

### 2. 安装系统工具（用于 RAR 和 7Z 解压）

#### macOS - 自动安装（推荐）

如果遇到 "系统未安装 unrar" 错误，可以使用自动安装脚本：

```bash
# 自动安装 Homebrew 和 unrar（如果需要）
./auto-install-unrar.sh
```

或者手动安装：

```bash
# 如果已有 Homebrew
brew install unrar p7zip

# 如果没有 Homebrew，先安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install unrar p7zip
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install unrar p7zip-full
```

#### Windows
- 下载并安装 [WinRAR](https://www.winrar.com/)（用于 RAR）
- 下载并安装 [7-Zip](https://www.7-zip.org/)（用于 7Z）

**注意**：ZIP 和 TAR 格式使用纯 Node.js 库，无需额外安装。

### 3. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问：`http://localhost:3000`

## 使用说明

1. **上传文件**：点击上传区域或直接拖拽压缩包文件
2. **等待解压**：系统会自动上传并解压文件
3. **查看文件**：解压完成后会显示文件列表
4. **下载文件**：点击文件旁边的"下载"按钮下载单个文件
5. **清理文件**：点击"清理文件"按钮删除上传和解压的文件

## 技术栈

- **后端**：Node.js + Express
- **前端**：原生 HTML/CSS/JavaScript
- **文件上传**：Multer（支持大文件）
- **解压库**：
  - ZIP: yauzl
  - RAR: 系统 unrar 命令
  - 7Z: 系统 7z/7za 命令
  - TAR/GZ: tar-stream + zlib

## 目录结构

```
.
├── server.js              # 主服务器文件
├── extractors/            # 解压器模块
│   ├── zipExtractor.js   # ZIP 解压器
│   ├── rarExtractor.js   # RAR 解压器
│   ├── tarExtractor.js   # TAR 解压器
│   └── 7zExtractor.js    # 7Z 解压器
├── public/                # 前端文件
│   └── index.html        # 主页面
├── uploads/              # 上传文件存储目录（自动创建）
└── extracted/            # 解压文件存储目录（自动创建）
```

## 部署到云端

本项目可以部署到多个平台，让网站长期可用。详细部署指南请查看 [DEPLOY.md](./DEPLOY.md)

### 快速部署选项：

- **Vercel**（推荐）：免费，部署简单，适合小文件
- **Railway**：支持大文件，功能完整
- **Render**：免费，但会休眠
- **自建 VPS**：完全控制，适合大文件和高并发

### 一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/universal-archive-extractor)

## 注意事项

1. **RAR 和 7Z 格式**需要系统安装相应的解压工具
2. **文件存储**：上传和解压的文件会保存在 `uploads/` 和 `extracted/` 目录
3. **安全性**：生产环境使用前请添加适当的身份验证和文件类型验证
4. **性能**：大文件解压可能需要较长时间，请耐心等待
5. **云端部署**：某些平台可能不支持系统工具安装，只能使用 ZIP 和 TAR 格式

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

