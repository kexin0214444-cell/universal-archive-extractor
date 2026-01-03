const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

// 检查系统是否安装了 7z
async function check7zInstalled() {
  try {
    await execAsync('which 7z');
    return true;
  } catch {
    try {
      await execAsync('which 7za');
      return true;
    } catch {
      return false;
    }
  }
}

// 使用系统命令解压 7z 文件
async function extract7z(archivePath, outputDir) {
  // 检查是否安装了 7z
  const isInstalled = await check7zInstalled();
  
  if (!isInstalled) {
    const os = require('os');
    const platform = os.platform();
    let installGuide = '';
    
    if (platform === 'darwin') {
      installGuide = '\n\n安装方法：\n' +
        '方法一（推荐）：安装 Homebrew 后执行：brew install p7zip\n' +
        '  安装 Homebrew：/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n' +
        '方法二：访问 https://www.7-zip.org/ 下载 macOS 版本';
    } else if (platform === 'linux') {
      installGuide = '\n\n安装方法：sudo apt-get install p7zip-full 或 sudo yum install p7zip';
    } else {
      installGuide = '\n\n安装方法：请下载并安装 7-Zip (https://www.7-zip.org/)';
    }
    
    throw new Error('系统未安装 7z，无法解压 7Z 文件。' + installGuide);
  }

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 尝试使用 7z 或 7za 命令
    let command;
    try {
      await execAsync('which 7z');
      command = '7z';
    } catch {
      command = '7za';
    }

    const { stdout, stderr } = await execAsync(`${command} x -o"${outputDir}/" "${archivePath}" -y`);
    
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
    throw new Error(`7z 解压失败: ${error.message}`);
  }
}

module.exports = { extract7z };

