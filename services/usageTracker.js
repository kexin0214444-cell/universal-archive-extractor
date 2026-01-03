// 使用量追踪器 - 用于免费计划用户控制 API 使用成本
// 由于免费计划无法设置硬性限额，需要在代码层面实现使用量控制

const fs = require('fs');
const path = require('path');

const USAGE_FILE = path.join(__dirname, '../.usage.json');
const MAX_COST = 4.5; // 设置最大成本为 $4.5，留出 $0.5 缓冲
const COST_PER_IMAGE = 0.02; // 估算每张图片成本 $0.02（根据实际调整）

// 读取使用记录
function getUsage() {
  if (fs.existsSync(USAGE_FILE)) {
    try {
      const data = fs.readFileSync(USAGE_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取使用记录失败:', error);
      return { totalCost: 0, requestCount: 0 };
    }
  }
  return { totalCost: 0, requestCount: 0 };
}

// 保存使用记录
function saveUsage(usage) {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (error) {
    console.error('保存使用记录失败:', error);
  }
}

// 检查是否超过限额
function checkLimit() {
  const usage = getUsage();
  if (usage.totalCost >= MAX_COST) {
    throw new Error(
      `已达到成本限额 $${MAX_COST}。已使用: $${usage.totalCost.toFixed(2)}，请求次数: ${usage.requestCount}。` +
      `请检查 OpenAI 后台余额或充值。`
    );
  }
  return usage;
}

// 记录一次 API 调用
function recordUsage(actualCost = null) {
  const usage = getUsage();
  usage.requestCount++;
  // 如果有实际成本数据，使用实际值；否则使用估算值
  usage.totalCost += actualCost || COST_PER_IMAGE;
  usage.lastUpdate = new Date().toISOString();
  saveUsage(usage);
  
  // 如果接近限额，发出警告
  if (usage.totalCost >= MAX_COST * 0.9) {
    console.warn(`⚠️  警告：已使用 $${usage.totalCost.toFixed(2)}，接近限额 $${MAX_COST}`);
  }
  
  return usage;
}

// 获取当前使用情况
function getUsageStats() {
  const usage = getUsage();
  return {
    totalCost: usage.totalCost,
    requestCount: usage.requestCount,
    remainingBudget: MAX_COST - usage.totalCost,
    lastUpdate: usage.lastUpdate
  };
}

// 重置使用记录（谨慎使用）
function resetUsage() {
  saveUsage({ 
    totalCost: 0, 
    requestCount: 0, 
    lastUpdate: new Date().toISOString() 
  });
  console.log('使用记录已重置');
}

// 根据 API 响应计算实际成本（需要根据 OpenAI API 实际响应格式调整）
function calculateCostFromResponse(response) {
  // GPT-4o 图像分析的成本计算
  // 输入 tokens: $0.0025 / 1K tokens
  // 输出 tokens: $0.01 / 1K tokens
  // 图像: $0.01 / 图像（低分辨率）或 $0.03 / 图像（高分辨率）
  
  if (!response.usage) {
    return null; // 无法计算，使用估算值
  }
  
  const inputTokens = response.usage.prompt_tokens || 0;
  const outputTokens = response.usage.completion_tokens || 0;
  
  // 估算成本（根据实际 API 定价调整）
  const inputCost = (inputTokens / 1000) * 0.0025;
  const outputCost = (outputTokens / 1000) * 0.01;
  const imageCost = 0.01; // 假设低分辨率图像
  
  return inputCost + outputCost + imageCost;
}

module.exports = {
  checkLimit,
  recordUsage,
  getUsage,
  getUsageStats,
  resetUsage,
  calculateCostFromResponse,
  MAX_COST,
  COST_PER_IMAGE
};

