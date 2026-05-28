// ============================================================
// IChingBoard —— 六条爻线展示区（克制版动爻）
// 物理抛掷 · 独立运动 · 克制动爻（无glow）
// ============================================================

import { motion } from 'framer-motion';
import { type ReactNode, useState, useEffect, useRef } from 'react';
import type { Line, IChingPhase } from '../../types';
import { PhysicalCoinTrio, ChangingCoin } from './PhysicalCoin';

interface IChingBoardProps {
  lines: Line[];
  /** 当前抛掷的三枚铜钱值 */
  coinValues: [number, number, number] | null;
  /** 当前阶段 */
  phase: IChingPhase;
  /** 动画完成回调 */
  onAnimationComplete?: () => void;
}

/** ============================================================
 * 动爻指示器（克制版 - 无 glow）
 * 极淡的金色边框呼吸
 * ============================================================ */
function ChangingYaoIndicator({ isChanging }: { isChanging: boolean }): ReactNode {
  const [borderOpacity, setBorderOpacity] = useState(0.4);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isChanging) {
      setBorderOpacity(0.4);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const duration = 4000; // 4秒一个周期（极缓慢）
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const progress = (elapsed % duration) / duration;

      // 极淡的透明度变化：0.35 → 0.65
      const opacity = 0.35 + Math.sin(progress * Math.PI * 2) * 0.15;
      setBorderOpacity(opacity);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isChanging]);

  if (!isChanging) return null;

  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{
        background: `rgba(212, 175, 55, ${borderOpacity})`,
        border: `1px solid rgba(212, 175, 55, ${borderOpacity})`,
      }}
    />
  );
}

/** ============================================================
 * 爻线组件（克制版动爻 - 无 glow）
 * ============================================================ */
function YaoLine({
  line,
  isLatest,
  showChanging,
}: {
  line: Line;
  isLatest: boolean;
  showChanging: boolean;
}): ReactNode {
  const isYang = line.type === '老阳' || line.type === '少阳';
  const [borderOpacity, setBorderOpacity] = useState(0);
  const animationRef = useRef<number | null>(null);

  // 动爻边框呼吸（克制）
  useEffect(() => {
    if (!line.isChanging || !showChanging) {
      setBorderOpacity(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const duration = 4000; // 4秒一个周期
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const progress = (elapsed % duration) / duration;

      // 极淡的边框透明度：0.3 → 0.6
      const opacity = 0.3 + Math.sin(progress * Math.PI * 2) * 0.15;
      setBorderOpacity(opacity);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [line.isChanging, showChanging]);

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: -12 } : false}
      animate={isLatest ? { opacity: 1, y: 0 } : { opacity: 1 }}
      transition={
        isLatest
          ? {
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.15,
            }
          : {}
      }
      className="flex items-center gap-3 w-full relative"
    >
      {isYang ? (
        <div
          className={`yao-bar flex-1 ${line.isChanging ? 'yao-bar--changing' : ''}`}
          style={
            line.isChanging && borderOpacity > 0
              ? {
                  borderColor: `rgba(212, 175, 55, ${borderOpacity})`,
                  boxShadow: 'none', // 克制：无阴影
                }
              : {}
          }
        />
      ) : (
        <div className="flex gap-4 flex-1 justify-center">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`yao-bar flex-1 max-w-[42%] ${line.isChanging ? 'yao-bar--changing' : ''}`}
              style={
                line.isChanging && borderOpacity > 0
                  ? {
                      borderColor: `rgba(212, 175, 55, ${borderOpacity})`,
                      boxShadow: 'none', // 克制：无阴影
                    }
                  : {}
              }
            />
          ))}
        </div>
      )}

      {/* 动爻指示器 */}
      <ChangingYaoIndicator isChanging={line.isChanging && showChanging} />

      <span className="text-stone-500 text-xs w-10 text-left shrink-0">
        {line.type}
      </span>
    </motion.div>
  );
}

export function IChingBoard({
  lines,
  coinValues,
  phase,
  onAnimationComplete,
}: IChingBoardProps): ReactNode {
  const latestIndex = lines.length > 0 ? lines[lines.length - 1].index : -1;

  // 动爻铜钱显示
  const [showChangingCoins, setShowChangingCoins] = useState(false);
  const [showChangingLines, setShowChangingLines] = useState(false);

  useEffect(() => {
    if (phase === 'completed') {
      const changingLines = lines.filter((l) => l.isChanging);
      if (changingLines.length > 0) {
        setShowChangingCoins(true);
        setShowChangingLines(true);
        const timeout = setTimeout(() => {
          setShowChangingCoins(false);
          setShowChangingLines(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [phase, lines]);

  const isThrowing = phase === 'throwing';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 物理铜钱动画区 */}
      <div className="relative h-[160px] flex items-center justify-center">
        {isThrowing && (
          <PhysicalCoinTrio
            coinValues={coinValues}
            active={isThrowing}
            onAllSettled={onAnimationComplete}
          />
        )}
      </div>

      {/* 爻线展示区 */}
      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        {[5, 4, 3, 2, 1, 0].map((targetIndex) => {
          const line = lines.find((l) => l.index === targetIndex);
          if (!line) return null;
          return (
            <YaoLine
              key={targetIndex}
              line={line}
              isLatest={line.index === latestIndex}
              showChanging={showChangingLines}
            />
          );
        })}
      </div>

      {/* 动爻铜钱展示 */}
      {showChangingCoins && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex gap-4 mt-2"
        >
          {lines
            .filter((l) => l.isChanging)
            .map((line) => (
              <ChangingCoin
                key={line.index}
                value={line.type === '老阳' ? 3 : 2}
                show={showChangingCoins}
              />
            ))}
        </motion.div>
      )}
    </div>
  );
}
