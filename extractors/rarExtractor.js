const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

// 获取 unrar 命令路径
async function getUnrarPath() {
  // 先检查系统路径
  try {
    await execAsync('which unrar');
    return 'unrar';
  } catch {
    // 检查项目目录中的 unrar
    const projectUnrar = path.join(__dirname, '..', 'bin', 'unrar');
    if (fs.existsSync(projectUnrar)) {
      return projectUnrar;
    }
    return null;
  }
}

// 使用系统命令解压 RAR 文件
async function extractRar(rarPath, outputDir) {
  // 获取 unrar 路径
  const unrarPath = await getUnrarPath();
  
  if (!unrarPath) {
    const os = require('os');
    const platform = os.platform();
    let installGuide = '';
    
    if (platform === 'darwin') {
      installGuide = '\n\n安装方法：\n' +
        '方法一（推荐）：安装 Homebrew 后执行：brew install unrar\n' +
        '  安装 Homebrew：/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n' +
        '方法二：手动下载安装\n' +
        '  1. 访问 https://www.rarlab.com/download.htm 下载 macOS 版本\n' +
        '  2. 解压后执行：sudo install -c -o $USER unrar /usr/local/bin/\n' +
        '或者运行项目目录下的 install-unrar.sh 脚本获取详细说明';
    } else if (platform === 'linux') {
      installGuide = '\n\n安装方法：sudo apt-get install unrar 或 sudo yum install unrar';
    } else {
      installGuide = '\n\n安装方法：请下载并安装 WinRAR 或 7-Zip';
    }
    
    throw new Error('系统未安装 unrar，无法解压 RAR 文件。' + installGuide);
  }

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 使用 unrar 命令解压
    const { stdout, stderr } = await execAsync(`"${unrarPath}" x -o+ "${rarPath}" "${outputDir}/"`);
    
    // 获取解压后的文件列表
    const extractedFiles = [];
    const scanDir = (dir, basePath = '') => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = basePath ? path.join(basePath, item) : item;
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          extractedFiles.push({
            name: relativePath + '/',
            type: 'directory'
          });
          scanDir(fullPath, relativePath);
        } else {
          extractedFiles.push({
            name: relativePath,
            type: 'file',
            size: stat.size
          });
        }
      });
    };

    scanDir(outputDir);
    return extractedFiles;
  } catch (error) {
    throw new Error(`RAR 解压失败: ${error.message}`);
  }
}

module.exports = { extractRar };

