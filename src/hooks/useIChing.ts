// ============================================================
// useIChing —— 六爻状态机 Hook（真实物理版）
// 流程：idle → throwing（物理抛掷 + 延迟揭示）→ 计算爻线 → idle/completed
// ============================================================

import { useState, useCallback, useMemo, useRef } from 'react';
import type { Line, IChingPhase } from '../types';
import {
  throwThreeCoinsIndividual,
  determineLine,
  buildHexagram,
} from '../utils/ichingLogic';
import { playDivinationConfirm, playChangingYaoActivate } from '../utils/sound';

/** 铜钱值 2=反面, 3=正面 */
export type CoinValue = 2 | 3;

/** 单枚 coin 预留位用 0 表示 */
type CoinSlot = CoinValue | 0;

const delay = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

export function useIChing() {
  const [phase, setPhase] = useState<IChingPhase>('idle');
  const [lines, setLines] = useState<Line[]>([]);
  const [currentThrow, setCurrentThrow] = useState(0);
  /** 当前抛掷的三枚铜钱值（0 表示尚未揭示） */
  const [coinValues, setCoinValues] = useState<[CoinSlot, CoinSlot, CoinSlot] | null>(null);
  /** 是否正在播放物理动画 */
  const [isAnimating, setIsAnimating] = useState(false);

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 摇一次卦：完整物理抛掷动画 → 延迟揭示 → 计算 */
  const throwCoins = useCallback(async (): Promise<void> => {
    if (phase !== 'idle' || currentThrow >= 6) return;

    setPhase('throwing');
    setCoinValues(null);
    setIsAnimating(true);

    // 预计算结果（不展示），保证随机性
    const coins = throwThreeCoinsIndividual();

    // ---- 阶段1：寂静（0-300ms）----
    await delay(150);
    
    // ---- 阶段2：铜钱出现，准备抛出（300ms）----
    setCoinValues([coins[0], coins[1], coins[2]] as [CoinSlot, CoinSlot, CoinSlot]);
    
    await delay(200); // 短暂确认

    // ---- 阶段3：物理动画进行中 ----
    // 铜钱组件内部处理：
    // - 抛出（释放声）
    // - 空中翻转
    // - 碰撞（首次撞击 + 弹跳）
    // - 静止
    // - 延迟揭示（静止后 400ms）
    
    // 等待物理动画完成（最长约 4 秒）
    await new Promise<void>((resolve) => {
      animationTimeoutRef.current = setTimeout(resolve, 4200);
    });
    
    setIsAnimating(false);

    // ---- 阶段4：命运凝定（确认结果）----
    await delay(300);
    
    // 播放卦象形成音效
    playDivinationConfirm();
    
    await delay(400);
    
    // 计算结果
    const coinSum = coins[0] + coins[1] + coins[2];
    const newLine = determineLine(currentThrow, coinSum);
    const nextThrow = currentThrow + 1;

    setLines((prev) => {
      const updatedLines = [...prev, newLine];
      
      // 如果是动爻，播放动爻激活音效
      if (newLine.isChanging) {
        setTimeout(() => playChangingYaoActivate(), 200);
      }
      
      return updatedLines;
    });
    setCurrentThrow(nextThrow);
    
    // 短暂显示结果后清除铜钱
    setTimeout(() => {
      setCoinValues(null);
    }, 800);

    if (nextThrow >= 6) {
      setPhase('completed');
    } else {
      setPhase('idle');
    }
  }, [phase, currentThrow]);

  const reset = useCallback((): void => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setPhase('idle');
    setLines([]);
    setCurrentThrow(0);
    setCoinValues(null);
    setIsAnimating(false);
  }, []);

  const hexagram = useMemo(() => {
    if (phase === 'completed' && lines.length === 6) {
      return buildHexagram(lines);
    }
    return null;
  }, [phase, lines]);

  return {
    phase,
    lines,
    currentThrow,
    coinValues,
    throwCoins,
    reset,
    hexagram,
    isAnimating,
  };
}
