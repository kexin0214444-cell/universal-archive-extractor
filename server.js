const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const archiver = require('archiver');
const { extractZip } = require('./extractors/zipExtractor');
const { extractRar } = require('./extractors/rarExtractor');
const { extractTar } = require('./extractors/tarExtractor');
const { extract7z } = require('./extractors/7zExtractor');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 确保目录存在
const uploadsDir = path.join(__dirname, 'uploads');
const extractedDir = path.join(__dirname, 'extracted');

[uploadsDir, extractedDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 配置 multer 用于大文件上传（无大小限制）
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: Infinity // 无大小限制
  }
});

// 获取文件扩展名
function getFileExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ext;
}

// 根据文件类型选择解压器
async function extractArchive(filePath, outputDir, originalName) {
  const ext = getFileExtension(originalName);
  
  try {
    switch (ext) {
      case '.zip':
        return await extractZip(filePath, outputDir);
      case '.rar':
        return await extractRar(filePath, outputDir);
      case '.tar':
      case '.gz':
      case '.tgz':
      case '.bz2':
      case '.xz':
        return await extractTar(filePath, outputDir);
      case '.7z':
        return await extract7z(filePath, outputDir);
      default:
        throw new Error(`不支持的文件格式: ${ext}`);
    }
  } catch (error) {
    throw new Error(`解压失败: ${error.message}`);
  }
}

// 上传并解压接口
app.post('/api/upload', upload.single('archive'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件' });
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const outputDir = path.join(extractedDir, path.basename(filePath, path.extname(filePath)));

  try {
    // 创建输出目录
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 解压文件
    const extractedFiles = await extractArchive(filePath, outputDir, originalName);

    // 只返回目录名，不包含路径前缀
    const dirName = path.basename(outputDir);
    res.json({
      success: true,
      message: '解压成功',
      originalName: originalName,
      extractedFiles: extractedFiles,
      outputDir: dirName
    });
  } catch (error) {
    console.error('解压错误:', error);
    // 清理文件
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    res.status(500).json({ error: error.message });
  }
});

// 获取解压后的文件列表
app.get('/api/files/:dir', (req, res) => {
  const dirPath = path.join(extractedDir, req.params.dir);
  
  if (!fs.existsSync(dirPath)) {
    return res.status(404).json({ error: '目录不存在' });
  }

  try {
    const files = [];
    const scanDir = (dir, basePath = '') => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push({
            name: item,
            path: relativePath,
            type: 'directory',
            size: null
          });
          scanDir(fullPath, relativePath);
        } else {
          files.push({
            name: item,
            path: relativePath,
            type: 'file',
            size: stat.size
          });
        }
      });
    };

    scanDir(dirPath);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 打包下载整个目录
app.get('/api/download-all/:dir(*)', (req, res) => {
  try {
    const dirName = req.params.dir;
    if (!dirName || dirName.includes('..')) {
      return res.status(400).json({ error: '无效的目录名' });
    }
    
    const dirPath = path.join(extractedDir, dirName);
    // 确保路径在 extractedDir 内，防止路径遍历
    if (!dirPath.startsWith(path.resolve(extractedDir))) {
      return res.status(400).json({ error: '无效的路径' });
    }
  
    if (!fs.existsSync(dirPath)) {
      return res.status(404).json({ error: '目录不存在' });
    }

    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) {
      return res.status(400).json({ error: '路径不是目录' });
    }

    // 设置响应头 - 必须在发送数据前设置
    const zipFileName = `${dirName}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(zipFileName)}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // 创建 archiver 实例
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高压缩级别
    });

    // 监听错误
    archive.on('error', (err) => {
      console.error('打包错误:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: '打包失败: ' + err.message });
      } else {
        res.end();
      }
    });

    // 监听警告
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('警告:', err);
      } else {
        throw err;
      }
    });

    // 监听完成事件
    archive.on('end', () => {
      console.log('打包完成，总大小:', archive.pointer(), 'bytes');
    });

    // 将输出管道连接到响应
    archive.pipe(res);

    // 监听响应结束
    res.on('close', () => {
      if (!archive.finalized) {
        console.warn('响应已关闭，但归档未完成');
        archive.abort();
      }
    });

    // 添加目录到压缩包
    // 第二个参数 false 表示不保留源目录的完整路径，只保留目录内容
    archive.directory(dirPath, false);

    // 完成打包
    archive.finalize().catch((err) => {
      console.error('finalize 错误:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: '打包失败: ' + err.message });
      }
    });
  } catch (error) {
    console.error('打包错误:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// 下载单个文件（保留用于兼容性，但前端不再使用）
app.get('/api/download/:dir/*', (req, res) => {
  const filePath = path.join(extractedDir, req.params.dir, req.params[0]);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    return res.status(400).json({ error: '不能下载目录' });
  }

  res.download(filePath);
});

// 清理临时文件
app.delete('/api/clean/:dir(*)', (req, res) => {
  try {
    // 安全地获取目录名，防止路径遍历攻击
    const dirName = req.params.dir;
    if (!dirName || dirName.includes('..') || dirName.includes('/') || dirName.includes('\\')) {
      return res.status(400).json({ error: '无效的目录名' });
    }
    
    const dirPath = path.join(extractedDir, dirName);
    // 确保路径在 extractedDir 内，防止路径遍历
    if (!dirPath.startsWith(path.resolve(extractedDir))) {
      return res.status(400).json({ error: '无效的路径' });
    }
    
    // 尝试查找对应的上传文件（可能有不同的扩展名）
    let filePath = null;
    const possibleExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.tgz', '.bz2', '.xz'];
    for (const ext of possibleExtensions) {
      const testPath = path.join(uploadsDir, dirName + ext);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }
    
    // 清理解压目录
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
    
    // 清理上传文件
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: '清理成功' });
  } catch (error) {
    console.error('清理错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

