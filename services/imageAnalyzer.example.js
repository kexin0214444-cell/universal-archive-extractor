// 图像分析服务示例 - 展示如何使用使用量追踪器
// 这是一个示例文件，你可以参考这个实现自己的 imageAnalyzer.js

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const { checkLimit, recordUsage, calculateCostFromResponse, getUsageStats } = require('./usageTracker');

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 将图像文件转换为 Base64 编码
 * @param {string} imagePath - 图像文件路径
 * @returns {string} Base64 编码的图像数据
 */
function encodeImageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

/**
 * 分析图像内容
 * @param {string} imagePath - 图像文件路径
 * @param {string} prompt - 分析提示词（可选）
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeImage(imagePath, prompt = '请详细描述这张图片的内容') {
  // 1. 检查是否超过使用限额
  try {
    checkLimit();
  } catch (error) {
    throw new Error(`使用量限制: ${error.message}`);
  }

  // 2. 检查文件是否存在
  if (!fs.existsSync(imagePath)) {
    throw new Error('图像文件不存在');
  }

  // 3. 检查文件大小（OpenAI 限制 20MB）
  const stats = fs.statSync(imagePath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  if (fileSizeInMB > 20) {
    throw new Error(`图像文件过大: ${fileSizeInMB.toFixed(2)}MB，最大支持 20MB`);
  }

  // 4. 将图像编码为 Base64
  const base64Image = encodeImageToBase64(imagePath);
  
  // 获取图像格式
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 
                   ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                   ext === '.gif' ? 'image/gif' :
                   ext === '.webp' ? 'image/webp' : 'image/jpeg';

  try {
    // 5. 调用 OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300 // 根据需要调整
    });

    // 6. 计算实际成本并记录使用量
    const actualCost = calculateCostFromResponse(response);
    recordUsage(actualCost);

    // 7. 返回分析结果
    return {
      success: true,
      description: response.choices[0].message.content,
      usage: response.usage,
      estimatedCost: actualCost || '使用估算值',
      usageStats: getUsageStats()
    };
  } catch (error) {
    // API 调用失败，不记录使用量（因为可能没有产生费用）
    console.error('OpenAI API 调用失败:', error);
    throw new Error(`图像分析失败: ${error.message}`);
  }
}

/**
 * 获取当前使用统计
 * @returns {Object} 使用统计信息
 */
function getUsageInfo() {
  return getUsageStats();
}

module.exports = {
  analyzeImage,
  getUsageInfo
};

