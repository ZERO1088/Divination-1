// ============================================================
// useAI —— AI 解卦 Hook
// 支持多种 AI 提供商：DeepSeek、阿里千问等
// 支持 demo 模式（模拟延迟返回通用解读）
// 防御性：防重、超时、错误分类、兜底文案
// ============================================================

import { useState, useCallback, useRef } from 'react';
import type { AIResponse, APIState, APIError } from '../types';
import { fetchWithTimeout, classifyError, FALLBACK_MESSAGE, generateTarotDemoReply } from '../utils/api';
import { currentAIConfig, isAIConfigured } from '../config/api';

/** 获取 API 端点（开发环境使用代理，生产环境直接请求） */
function getEndpoint(): string {
  return '/api/ai';
}

interface AIConfigInput {
  /** 自定义 API 端点，不传则使用配置文件中的 */
  endpoint?: string;
  /** 自定义 API Key */
  apiKey?: string;
  /** 自定义模型名称 */
  model?: string;
  /** 超时毫秒数 */
  timeoutMs?: number;
  /** Temperature 参数（0-2） */
  temperature?: number;
}

/** 六爻 Demo 模式下的通用解读 */
function generateIChingDemoReply(): string {
  return (
    '【通俗解读】\n' +
    '此卦象提示你，当前所问之事正处于发展变化之中。' +
    '建议你保持冷静的头脑，不急不躁，稳步推进。' +
    '如果卦中有变爻，意味着事情还有转圜的余地——' +
    '关注变化的方向，顺势而为，往往能得到更好的结果。' +
    '记住：易者变也，没有一成不变的答案，你的选择才是关键。\n\n' +
    '【建议】\n' +
    '当前卦象显示事情仍有变数，建议：\n' +
    '1. 保持耐心，不要急于做决定\n' +
    '2. 关注事态发展，等待有利时机\n' +
    '3. 做好两手准备，灵活应对\n\n' +
    '【专业提示】\n' +
    '当前为 Demo 模式。配置 API Key 可获得 AI 深度解读。'
  );
}

export function useAI(config: AIConfigInput = {}) {
  const defaultConfig = currentAIConfig();
  const apiEndpoint = getEndpoint();
  
  const {
    apiKey = defaultConfig.apiKey,
    model = defaultConfig.model,
    timeoutMs = defaultConfig.timeoutMs,
    temperature = defaultConfig.temperature,
  } = config;

  const [state, setState] = useState<APIState>('idle');
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState<APIError | null>(null);

  // 保存当前的 AbortController，用于组件卸载时取消
  const abortRef = useRef<AbortController | null>(null);

  // 防止 StrictMode 下重复调用
  const loadingRef = useRef(false);

  /** 发起解卦请求 */
  const analyze = useCallback(
    async (
      prompt: string,
      mode: 'iching' | 'tarot' = 'iching',
      demoMeta?: { cardName?: string; isReversed?: boolean; question?: string },
      systemPrompt?: string,
    ): Promise<void> => {
      // 防重：loading 中忽略新请求
      if (loadingRef.current) return;
      loadingRef.current = true;

      setState('loading');
      setError(null);

      try {
        // ---- Demo 模式：模拟延迟 + 占卜体系专属回复 ----
        if (!apiEndpoint || !isAIConfigured()) {
          await new Promise<void>((resolve) => setTimeout(resolve, 2000));
          const reply =
            mode === 'tarot'
              ? generateTarotDemoReply({
                  cardName: demoMeta?.cardName ?? '未知',
                  isReversed: demoMeta?.isReversed ?? false,
                  question: demoMeta?.question ?? '',
                })
              : generateIChingDemoReply();
          setResult({ content: reply, model: 'demo' });
          setState('success');
          loadingRef.current = false;
          return;
        }

        // ---- 真实 API 模式 ----
        const controller = new AbortController();
        abortRef.current = controller;

        // 构建消息列表（如果有 systemPrompt 则添加系统消息）
        const messages: Array<{ role: string; content: string }> = [];
        if (systemPrompt) {
          messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const response = await fetchWithTimeout(
          apiEndpoint,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              messages,
              stream: false,
              temperature: temperature,
            }),
          },
          timeoutMs,
        );

        if (!response.ok) {
          // 尝试从响应体中提取 API 错误详情
          let apiErrorMsg = `服务器返回错误: ${response.status} ${response.statusText}`;
          try {
            const errData: Record<string, unknown> = await response.json();
            const errDetail = (errData.error as { message?: string })?.message;
            if (errDetail) apiErrorMsg = errDetail;
          } catch {
            // 无法解析 JSON，使用默认错误信息
          }
          throw new Error(apiErrorMsg);
        }

        const data: Record<string, unknown> = await response.json();
        const choices = data.choices as Array<{ message: { content: string } }> | undefined;
        const content = choices?.[0]?.message?.content ?? FALLBACK_MESSAGE;

        setResult({ content, model });
        setState('success');
      } catch (err: unknown) {
        const classified = classifyError(err);
        setError(classified);
        // 保留 API 原始错误信息，而非直接覆盖为兜底文案
        setResult({ content: classified.message });
        setState('error');
      } finally {
        loadingRef.current = false;
        abortRef.current = null;
      }
    },
    [apiEndpoint, apiKey, model, timeoutMs, temperature],
  );

  /** 重置，允许重新请求 */
  const reset = useCallback((): void => {
    // 取消进行中的请求
    abortRef.current?.abort();
    abortRef.current = null;

    setState('idle');
    setResult(null);
    setError(null);
    loadingRef.current = false;
  }, []);

  return { state, result, error, analyze, reset };
}

// 保持向后兼容
export const useDeepSeek = useAI;
