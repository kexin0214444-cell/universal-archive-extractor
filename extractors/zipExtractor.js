const yauzl = require('yauzl');
const fs = require('fs');
const path = require('path');

function extractZip(zipPath, outputDir) {
  return new Promise((resolve, reject) => {
    const extractedFiles = [];

    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);

      zipfile.readEntry();
      
      zipfile.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          // 目录
          const dirPath = path.join(outputDir, entry.fileName);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          extractedFiles.push({
            name: entry.fileName,
            type: 'directory'
          });
          zipfile.readEntry();
        } else {
          // 文件
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) return reject(err);

            const filePath = path.join(outputDir, entry.fileName);
            const dir = path.dirname(filePath);
            
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }

            const writeStream = fs.createWriteStream(filePath);
            readStream.pipe(writeStream);

            writeStream.on('close', () => {
              extractedFiles.push({
                name: entry.fileName,
                type: 'file',
                size: entry.uncompressedSize
              });
              zipfile.readEntry();
            });

            writeStream.on('error', reject);
          });
        }
      });

      zipfile.on('end', () => {
        resolve(extractedFiles);
      });

      zipfile.on('error', reject);
    });
  });
}

module.exports = { extractZip };

