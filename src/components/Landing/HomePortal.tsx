// ============================================================
// HomePortal.tsx —— 主界面：虚空之门
// 两个精神空间入口 · 沉浸体验 · 无导航感
// ============================================================

import { type ReactNode, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleSystem } from '../common/ParticleSystem';

// ============================================================
// 子组件：Tarot Space
// ============================================================
interface TarotSpaceProps {
  isActive: boolean;
  isOtherActive: boolean;
  onEnter: () => void;
}

function TarotSpace({ isActive, isOtherActive, onEnter }: TarotSpaceProps): ReactNode {
  const [isHovered, setIsHovered] = useState(false);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    if (isHovered && !isOtherActive) {
      const timer = setTimeout(() => setShowEnter(true), 400);
      return () => clearTimeout(timer);
    } else {
      setShowEnter(false);
    }
  }, [isHovered, isOtherActive]);

  return (
    <motion.div
      className="relative w-[320px] h-[420px] cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isOtherActive ? 0.3 : 1,
        scale: isActive ? 1.15 : 1,
        y: isHovered && !isOtherActive ? -12 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEnter}
    >
      {/* 卡片背景 */}
      <div
        className="absolute inset-0 rounded-[32px] transition-all duration-500"
        style={{
          background: isHovered && !isOtherActive
            ? 'linear-gradient(145deg, rgba(60, 40, 70, 0.35), rgba(40, 25, 50, 0.45))'
            : 'linear-gradient(145deg, rgba(40, 25, 50, 0.15), rgba(30, 20, 40, 0.25))',
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(147, 112, 219, ${isHovered && !isOtherActive ? 0.3 : 0.15})`,
          boxShadow: isHovered && !isOtherActive
            ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 80px rgba(138, 43, 226, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 15px 35px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* 月光光晕 */}
      <div
        className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(147, 112, 219, 0.15) 0%, transparent 70%)',
          opacity: isHovered && !isOtherActive ? 1 : 0.4,
          animation: 'moonPulse 4s ease-in-out infinite',
        }}
      />

      {/* 内部纹理 */}
      <div
        className="absolute inset-8 rounded-2xl overflow-hidden opacity-0 transition-opacity duration-700"
        style={{ opacity: isHovered && !isOtherActive ? 0.08 : 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-transparent" />
        {/* 塔罗牌轮廓暗示 */}
        <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full opacity-20">
          <rect x="10" y="10" width="80" height="120" rx="4" fill="none" stroke="rgba(147,112,219,0.5)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(147,112,219,0.3)" strokeWidth="0.3" />
        </svg>
      </div>

      {/* 内容 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
        {/* 主标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif tracking-[0.3em] text-purple-200/90 mb-3">
            TAROT
          </h2>
          <p className="text-sm font-light text-purple-300/60 tracking-widest mb-2">
            潜意识之境
          </p>
          <p className="text-xs text-stone-500 tracking-wider">
            探索命运的隐喻
          </p>
        </motion.div>

        {/* 进入提示 */}
        <AnimatePresence>
          {showEnter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-12"
            >
              <span className="text-xs text-purple-300/50 tracking-widest border-b border-purple-300/30 pb-1">
                进入
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 粒子效果指示 */}
      {isHovered && !isOtherActive && (
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-300/40"
              initial={{
                x: Math.random() * 320,
                y: 420,
                opacity: 0,
              }}
              animate={{
                y: -20,
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================
// 子组件：I Ching Space
// ============================================================
interface IChingSpaceProps {
  isActive: boolean;
  isOtherActive: boolean;
  onEnter: () => void;
}

function IChingSpace({ isActive, isOtherActive, onEnter }: IChingSpaceProps): ReactNode {
  const [isHovered, setIsHovered] = useState(false);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    if (isHovered && !isOtherActive) {
      const timer = setTimeout(() => setShowEnter(true), 400);
      return () => clearTimeout(timer);
    } else {
      setShowEnter(false);
    }
  }, [isHovered, isOtherActive]);

  return (
    <motion.div
      className="relative w-[320px] h-[420px] cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isOtherActive ? 0.3 : 1,
        scale: isActive ? 1.15 : 1,
        y: isHovered && !isOtherActive ? -12 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEnter}
    >
      {/* 卡片背景 */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: isHovered && !isOtherActive
            ? 'linear-gradient(145deg, rgba(30, 40, 45, 0.35), rgba(20, 30, 35, 0.45))'
            : 'linear-gradient(145deg, rgba(20, 30, 35, 0.15), rgba(15, 25, 30, 0.25))',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: `1px solid rgba(212, 175, 55, ${isHovered && !isOtherActive ? 0.25 : 0.1})`,
          boxShadow: isHovered && !isOtherActive
            ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 80px rgba(212, 175, 55, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            : '0 15px 35px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* 晨曦光晕 */}
      <div
        className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          opacity: isHovered && !isOtherActive ? 0.8 : 0.3,
          animation: 'dawnPulse 5s ease-in-out infinite',
        }}
      />

      {/* 八卦线条暗示 */}
      <div
        className="absolute inset-8 opacity-0 transition-opacity duration-700"
        style={{ opacity: isHovered && !isOtherActive ? 0.1 : 0 }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(212,175,55,0.2)" strokeWidth="0.3" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(212,175,55,0.2)" strokeWidth="0.3" />
        </svg>
      </div>

      {/* 内容 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
        {/* 主标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-4xl font-serif text-amber-200/80 mb-3">
            易经
          </h2>
          <p className="text-sm font-light text-amber-300/50 tracking-widest mb-2">
            变化之道
          </p>
          <p className="text-xs text-stone-500 tracking-wider">
            洞悉变易之理
          </p>
        </motion.div>

        {/* 进入提示 */}
        <AnimatePresence>
          {showEnter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-12"
            >
              <span className="text-xs text-amber-300/50 tracking-widest border-b border-amber-300/30 pb-1">
                进入
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 旋转线条粒子 */}
      {isHovered && !isOtherActive && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-8 bg-gradient-to-b from-amber-400/60 to-transparent"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: 'center bottom',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================
// 主组件：HomePortal
// ============================================================
export default function HomePortal(): ReactNode {
  const navigate = useNavigate();
  const [activeSpace, setActiveSpace] = useState<'tarot' | 'iching' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = (space: 'tarot' | 'iching') => {
    if (isTransitioning) return;
    
    setActiveSpace(space);
    setIsTransitioning(true);

    // 过渡动画后导航
    setTimeout(() => {
      navigate(space === 'tarot' ? '/tarot-question' : '/iching-question');
    }, 800);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        background: activeSpace === 'tarot'
          ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1020 50%, #0f0a15 100%)'
          : activeSpace === 'iching'
            ? 'linear-gradient(135deg, #0a0a0f 0%, #101820 50%, #0a1015 100%)'
            : '#050508',
      }}
    >
      {/* 全局粒子系统 */}
      <ParticleSystem type="ambient" density={15} />

      {/* 中心 Logo */}
      <motion.div
        className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.div
          className="text-amber-200/40 text-xs tracking-[0.5em] mb-2"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          占卜
        </motion.div>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-amber-200/20 to-transparent mx-auto" />
      </motion.div>

      {/* 两个空间入口 */}
      <div className="absolute inset-0 flex items-center justify-center gap-16 z-10">
        <TarotSpace
          isActive={activeSpace === 'tarot'}
          isOtherActive={activeSpace === 'iching'}
          onEnter={() => handleEnter('tarot')}
        />
        <IChingSpace
          isActive={activeSpace === 'iching'}
          isOtherActive={activeSpace === 'tarot'}
          onEnter={() => handleEnter('iching')}
        />
      </div>

      {/* 底部指引 */}
      <motion.div
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <p className="text-stone-600/50 text-xs tracking-[0.3em]">
          选择你要进入的空间
        </p>
      </motion.div>

      {/* 过渡遮罩 */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: activeSpace === 'tarot'
                ? 'radial-gradient(circle at center, rgba(60, 40, 70, 0.3) 0%, #0a0a0f 100%)'
                : 'radial-gradient(circle at center, rgba(30, 40, 45, 0.3) 0%, #0a0a0f 100%)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
