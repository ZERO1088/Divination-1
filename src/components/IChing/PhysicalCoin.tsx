// ============================================================
// PhysicalCoin.tsx —— 物理铜钱组件（真实物理版）
// 抛物线 · 独立运动 · 延迟揭示 · 克制动爻
// ============================================================

import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import {
  generateCoinPhysics,
  launchCoin,
  updatePhysics,
  type CoinPhysics,
} from '../../utils/physicalAnimation';
import {
  playCoinRelease,
  playCoinImpact,
  playCoinBounce,
  playCoinSettle,
} from '../../utils/enhancedSound';

interface SingleCoinProps {
  /** 铜钱面值：2=反面, 3=正面, 0=未揭示 */
  value: number;
  /** 是否激活动画 */
  active: boolean;
  /** 动画完成回调 */
  onSettled?: () => void;
  /** 初始 X 偏移 */
  offsetX?: number;
  /** 启动延迟 (ms) */
  launchDelay?: number;
}

const COIN_SIZE = 54;

/** 单枚物理铜钱 */
function SinglePhysicalCoin({
  value,
  active,
  onSettled,
  offsetX = 0,
  launchDelay = 0,
}: SingleCoinProps): ReactNode {
  const [physics, setPhysics] = useState<CoinPhysics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const hasPlayedRelease = useRef(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 重置状态
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
    setPhysics(null);
    setIsVisible(false);
    setIsRevealed(false);
    lastTimeRef.current = 0;
    hasPlayedRelease.current = false;
  }, []);

  // 初始化铜钱物理
  const initCoin = useCallback(() => {
    const newPhysics = generateCoinPhysics({ floorY: 130 });
    newPhysics.x = offsetX;
    return newPhysics;
  }, [offsetX]);

  // 动画循环
  useEffect(() => {
    if (!isVisible || !physics) return;

    const animate = (time: number) => {
      const deltaTime = lastTimeRef.current ? time - lastTimeRef.current : 16.67;
      lastTimeRef.current = time;

      const updated = updatePhysics(physics, deltaTime);
      setPhysics(updated);

      // 检测撞击事件
      if (physics.stage === 'falling' && updated.stage === 'bouncing' && updated.bounceCount === 1) {
        playCoinImpact(1);
      } else if (physics.stage === 'bouncing' && updated.bounceCount > physics.bounceCount) {
        playCoinBounce(updated.bounceCount);
      }

      // 检测静止
      if (updated.settled && !physics.settled) {
        playCoinSettle();
        
        // 静止后延迟揭示结果（300-500ms）
        revealTimeoutRef.current = setTimeout(() => {
          setIsRevealed(true);
          onSettled?.();
        }, 400);
      }

      // 继续动画
      if (!updated.settled || !updated.revealed) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, physics, onSettled]);

  // 监听 active 变化
  useEffect(() => {
    if (active) {
      reset();
      
      // 1. 先显示铜钱（准备阶段）
      const visibleTimeout = setTimeout(() => {
        setIsVisible(true);
        const coin = initCoin();
        setPhysics(coin);

        // 2. 延迟启动物理运动
        const launchTimeout = setTimeout(() => {
          if (physics) {
            const launched = launchCoin(physics);
            setPhysics(launched);
            hasPlayedRelease.current = true;
            playCoinRelease();
            lastTimeRef.current = performance.now();
          }
        }, launchDelay);

        return () => clearTimeout(launchTimeout);
      }, 150); // 准备阶段延迟

      return () => clearTimeout(visibleTimeout);
    } else {
      reset();
    }
  }, [active, launchDelay, reset, initCoin]);

  if (!isVisible || !physics) {
    return <div className="w-[54px] h-[54px]" />;
  }

  // 计算视觉样式
  const scale = 1 + (physics.y / 130) * 0.08;
  const opacity = isRevealed ? 1 : Math.min(1, 0.6 + (physics.y / 130) * 0.4);
  
  // 3D 翻转效果
  const flipProgress = physics.flipCount % 1;
  const rotationX = Math.sin(flipProgress * Math.PI) * 70;
  
  // 边缘压缩（模拟透视）
  const scaleX = 0.7 + Math.abs(Math.cos(flipProgress * Math.PI)) * 0.3;

  const isHead = value === 3;
  const label = isRevealed && value !== 0 ? (isHead ? '正' : '反') : '';

  // 铜钱样式
  const getCoinStyle = () => {
    if (!isRevealed || value === 0) {
      return 'bg-amber-900/30 border-2 border-amber-700/50';
    }
    return isHead
      ? 'bg-gradient-to-b from-amber-700/40 to-amber-900/50 border-2 border-amber-500/60'
      : 'bg-gradient-to-b from-stone-600/30 to-stone-800/40 border-2 border-stone-500/50';
  };

  return (
    <div
      className="absolute"
      style={{
        transform: `
          translateX(${physics.x}px)
          translateY(${-physics.y}px)
          scale(${scale})
        `,
        left: '50%',
        marginLeft: -COIN_SIZE / 2 + offsetX,
        width: COIN_SIZE,
        height: COIN_SIZE,
        zIndex: Math.floor(physics.y) + 10,
        opacity,
      }}
    >
      {/* 3D 翻转容器 */}
      <div
        className="w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '200px',
          transform: `
            rotateX(${rotationX}deg)
            rotateZ(${physics.rotation}deg)
            scaleX(${scaleX})
          `,
        }}
      >
        {/* 铜钱本体 */}
        <div
          className={`
            w-full h-full rounded-full
            flex items-center justify-center
            font-serif text-base font-medium
            ${getCoinStyle()}
          `}
          style={{
            boxShadow: physics.stage === 'bouncing' || physics.stage === 'sliding'
              ? '0 6px 16px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.08)'
              : '0 3px 10px rgba(0,0,0,0.25)',
          }}
        >
          {/* 内圈 */}
          <div className="absolute inset-2 rounded-full border border-current/25" />
          
          {/* 边缘装饰 */}
          <div className="absolute inset-1 rounded-full border border-current/15" />

          {/* 文字 */}
          <span
            className={`
              relative z-10 tracking-wider
              transition-opacity duration-500
              ${isRevealed ? 'opacity-100' : 'opacity-0'}
              ${isHead ? 'text-amber-200/90' : 'text-stone-300/70'}
            `}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

/** ============================================================
 * 物理铜钱三人组组件
 * ============================================================ */
interface PhysicalCoinTrioProps {
  /** 三枚铜钱值 */
  coinValues: [number, number, number] | null;
  /** 是否激活 */
  active: boolean;
  /** 全部静止回调 */
  onAllSettled?: () => void;
}

export function PhysicalCoinTrio({
  coinValues,
  active,
  onAllSettled,
}: PhysicalCoinTrioProps): ReactNode {
  const [settledCount, setSettledCount] = useState(0);
  
  // 固定的偏移和延迟（模拟真实独立运动）
  const offsets = [-30, 0, 30];
  const delays = [0, 120, 240];

  // 重置计数
  useEffect(() => {
    if (active) {
      setSettledCount(0);
    }
  }, [active]);

  // 全部静止时触发回调
  useEffect(() => {
    if (settledCount >= 3 && onAllSettled) {
      const timeout = setTimeout(() => {
        onAllSettled();
      }, 600); // 等待揭示完成后
      return () => clearTimeout(timeout);
    }
  }, [settledCount, onAllSettled]);

  const handleSettled = useCallback(() => {
    setSettledCount(prev => Math.min(prev + 1, 3));
  }, []);

  if (!coinValues) return null;

  return (
    <div className="relative w-[200px] h-[160px]">
      {coinValues.map((value, index) => (
        <SinglePhysicalCoin
          key={index}
          value={value}
          active={active}
          onSettled={handleSettled}
          offsetX={offsets[index]}
          launchDelay={delays[index]}
        />
      ))}
    </div>
  );
}

/** ============================================================
 * 动爻铜钱组件（克制版 - 无夸张 glow）
 * ============================================================ */
interface ChangingCoinProps {
  value: number;
  show: boolean;
}

export function ChangingCoin({ value, show }: ChangingCoinProps): ReactNode {
  const [borderOpacity, setBorderOpacity] = useState(0.5);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!show) {
      setBorderOpacity(0.5);
      return;
    }

    // 缓慢的呼吸效果（4秒周期）
    let startTime: number | null = null;
    const duration = 4000;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = (elapsed % duration) / duration;
      
      // 极缓慢的透明度变化（0.4-0.8）
      const opacity = 0.4 + Math.sin(progress * Math.PI * 2) * 0.2;
      setBorderOpacity(opacity);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [show]);

  if (!show) return null;

  const isHead = value === 3;
  const label = isHead ? '正' : '反';

  return (
    <div
      className={`
        w-11 h-11 rounded-full
        flex items-center justify-center
        font-serif text-sm
        border-2
        transition-all duration-700
      `}
      style={{
        background: isHead
          ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,134,11,0.2))'
          : 'linear-gradient(135deg, rgba(120,113,108,0.15), rgba(87,83,78,0.2))',
        borderColor: isHead
          ? `rgba(212, 175, 55, ${borderOpacity})`
          : 'rgba(120,113,108,0.5)',
        opacity: 0.75,
      }}
    >
      <span
        className={isHead ? 'text-amber-300/80' : 'text-stone-400/60'}
      >
        {label}
      </span>
    </div>
  );
}
