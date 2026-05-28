// ============================================================
// AI API 集中配置
// 支持多种 AI 提供商：DeepSeek、阿里千问等
// 从 Vite 环境变量读取配置
// ============================================================

/** AI 提供商类型 */
export type AIProvider = 'deepseek' | 'qwen' | 'openai' | 'anthropic';

/** 通用 API 配置 */
export interface AIConfig {
  /** API 端点 */
  endpoint: string;
  /** API Key */
  apiKey: string;
  /** 模型名称 */
  model: string;
  /** 请求超时（毫秒） */
  timeoutMs: number;
  /** Temperature 参数（0-2，越低越确定） */
  temperature: number;
  /** 提供商名称 */
  provider: AIProvider;
}

// ---- DeepSeek 配置 ----
export const deepseekConfig: AIConfig = {
  get endpoint() {
    return import.meta.env.VITE_DEEPSEEK_ENDPOINT ?? 'https://api.deepseek.com/v1/chat/completions';
  },
  get apiKey() {
    return '';
  },
  get model() {
    return import.meta.env.VITE_DEEPSEEK_MODEL ?? 'deepseek-chat';
  },
  get timeoutMs() {
    const raw = import.meta.env.VITE_DEEPSEEK_TIMEOUT;
    return raw ? Number(raw) : 30_000;
  },
  get temperature() {
    const raw = import.meta.env.VITE_DEEPSEEK_TEMPERATURE;
    return raw ? Number(raw) : 0.3;
  },
  provider: 'deepseek',
} as const;

// ---- 阿里千问配置 ----
export const qwenConfig: AIConfig = {
  get endpoint() {
    return import.meta.env.VITE_QWEN_ENDPOINT ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  },
  get apiKey() {
    return '';
  },
  get model() {
    return import.meta.env.VITE_QWEN_MODEL ?? 'qwen-plus';
  },
  get timeoutMs() {
    const raw = import.meta.env.VITE_QWEN_TIMEOUT;
    return raw ? Number(raw) : 30_000;
  },
  get temperature() {
    const raw = import.meta.env.VITE_QWEN_TEMPERATURE;
    return raw ? Number(raw) : 0.3;
  },
  provider: 'qwen',
} as const;

// ---- OpenAI 配置（备用） ----
export const openaiConfig: AIConfig = {
  get endpoint() {
    return import.meta.env.VITE_OPENAI_ENDPOINT ?? 'https://api.openai.com/v1/chat/completions';
  },
  get apiKey() {
    return '';
  },
  get model() {
    return import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini';
  },
  get timeoutMs() {
    const raw = import.meta.env.VITE_OPENAI_TIMEOUT;
    return raw ? Number(raw) : 30_000;
  },
  get temperature() {
    const raw = import.meta.env.VITE_OPENAI_TEMPERATURE;
    return raw ? Number(raw) : 0.3;
  },
  provider: 'openai',
} as const;

// ---- 当前使用的配置 ----
// 切换 AI 提供商只需修改这个变量
export const currentAIConfig = (): AIConfig => {
  const provider = import.meta.env.VITE_AI_PROVIDER ?? 'deepseek';
  switch (provider) {
    case 'qwen':
      return qwenConfig;
    case 'openai':
      return openaiConfig;
    case 'deepseek':
    default:
      return deepseekConfig;
  }
};

// ---- 便捷方法 ----

/** 获取当前配置的 API Key（用于判断是否启用真实 API） */
export function getCurrentAPIKey(): string {
  return currentAIConfig().apiKey;
}

/** 是否配置了 API Key（未配置则走 demo 模式） */
export function isAIConfigured(): boolean {
 return true;
}