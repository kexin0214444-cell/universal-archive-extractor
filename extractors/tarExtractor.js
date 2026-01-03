const tar = require('tar-stream');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createReadStream, createWriteStream } = require('fs');

function extractTar(tarPath, outputDir) {
  return new Promise((resolve, reject) => {
    const extractedFiles = [];
    const basename = path.basename(tarPath).toLowerCase();
    
    // 检查是否为压缩的 tar 文件
    const isGz = basename.endsWith('.gz') || basename.endsWith('.tgz');
    const isBz2 = basename.endsWith('.bz2') || basename.endsWith('.tar.bz2');
    const isXz = basename.endsWith('.xz') || basename.endsWith('.tar.xz');
    
    // 对于 bz2 和 xz，使用系统命令（Node.js 原生不支持）
    if (isBz2 || isXz) {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      const flag = isBz2 ? 'j' : 'J';
      return execAsync(`tar -x${flag}f "${tarPath}" -C "${outputDir}"`)
        .then(() => {
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
          resolve(extractedFiles);
        })
        .catch(reject);
    }
    
    // 对于 .tar 和 .gz/.tgz，使用 tar-stream
    let inputStream;
    if (isGz) {
      inputStream = createReadStream(tarPath).pipe(zlib.createGunzip());
    } else {
      inputStream = createReadStream(tarPath);
    }

    const extract = tar.extract();
    
    extract.on('entry', (header, stream, next) => {
      const filePath = path.join(outputDir, header.name);
      
      if (header.type === 'directory') {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        extractedFiles.push({
          name: header.name + '/',
          type: 'directory'
        });
        stream.on('end', next);
        stream.resume();
      } else if (header.type === 'file') {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        const writeStream = createWriteStream(filePath);
        stream.pipe(writeStream);
        
        writeStream.on('finish', () => {
          extractedFiles.push({
            name: header.name,
            type: 'file',
            size: header.size
          });
          next();
        });
        
        writeStream.on('error', reject);
      } else {
        stream.on('end', next);
        stream.resume();
      }
    });

    extract.on('finish', () => {
      resolve(extractedFiles);
    });

    extract.on('error', reject);
    inputStream.pipe(extract);
  });
}

module.exports = { extractTar };

