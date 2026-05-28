// ============================================================
// TarotCard —— 塔罗单牌组件 (REFINED)
// 三态：网格态 / 聚光灯态 / 弱化态
// 22张大阿卡纳专属SVG几何艺术牌面
// 玻璃态磨砂效果 + 暗金边框 + 柔和交互
// ============================================================

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import type { TarotCardData } from '../../constants/tarotData';
import { TAROT_MAJOR_ARCANA_SVGS, CARD_COLORS } from './TarotMajorArcana';

interface TarotCardProps {
  data: TarotCardData;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  /** 聚光灯态——选中后的放大居中版 */
  spotlight?: boolean;
  /** 弱化态——其他牌被选中时的背景牌 */
  dimmed?: boolean;
  /** 紧凑模式——手机端网格布局 */
  compact?: boolean;
  /** 自定义尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否逆位 */
  isReversed?: boolean;
}

const ROMAN: string[] = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII',
  'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV',
  'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
];

// ============================================================
// TarotCard 主组件
// ============================================================
export function TarotCard({
  data,
  isSelected,
  onClick,
  disabled,
  spotlight = false,
  dimmed = false,
  compact = false,
  size = 'medium',
  isReversed = false,
}: TarotCardProps): ReactNode {
  // 尺寸配置 - 根据 size prop 和模式
  const getSize = () => {
    if (spotlight) return { w: 220, h: 340 };
    if (size === 'small' || compact) return { w: 72, h: 112 };
    if (size === 'large') return { w: 120, h: 186 };
    return { w: 100, h: 155 };
  };
  const { w: cardW, h: cardH } = getSize();

  // 获取对应的大阿卡纳 SVG 组件
  const SVGComponent = TAROT_MAJOR_ARCANA_SVGS[data.id];

  // SVG 尺寸
  const getSvgSize = () => {
    if (spotlight) return 180;
    if (size === 'small' || compact) return 50;
    if (size === 'large') return 90;
    return 70;
  };
  const svgSize = getSvgSize();

  return (
    <motion.div
      animate={{
        opacity: dimmed ? 0.08 : spotlight ? 1 : 0.55,
        filter: dimmed ? 'blur(8px)' : 'blur(0px)',
        scale: dimmed ? 0.92 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={
        !disabled && !spotlight && !dimmed
          ? { opacity: 1, scale: 1.06, transition: { duration: 0.2 } }
          : undefined
      }
      onClick={disabled || dimmed ? undefined : onClick}
      className={`relative shrink-0 ${isSelected && !spotlight ? 'tarot-card-selected' : ''}`}
      style={{
        width: cardW,
        height: cardH,
        perspective: 800,
        cursor: disabled || dimmed ? 'default' : 'pointer',
        pointerEvents: dimmed ? 'none' : 'auto',
      }}
    >
      {/* 聚光灯光晕（选中牌背后）- 增大光晕 */}
      {spotlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="absolute pointer-events-none"
          style={{
            top: '-60%',
            left: '-60%',
            width: '220%',
            height: '220%',
            background:
              'radial-gradient(ellipse 600px 500px at center, rgba(253,230,138,0.15) 0%, transparent 65%)',
          }}
        />
      )}

      {/* 选中牌外发光（聚光灯态）- 增强发光效果 */}
      {spotlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="absolute -inset-3 rounded-2xl pointer-events-none"
          style={{
            boxShadow:
              '0 0 60px rgba(253,230,138,0.2), 0 0 120px rgba(253,230,138,0.08)',
          }}
        />
      )}

      {/* 选中高亮光环（网格态） */}
      {isSelected && !spotlight && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1.04 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="absolute -inset-1 rounded-xl pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(253,230,138,0.35), rgba(253,200,80,0.15), rgba(253,230,138,0.35))',
            filter: 'blur(6px)',
          }}
        />
      )}

      {/* 聚光灯模式：直接显示卡面，无需翻转动画 */}
      {spotlight && isSelected ? (
        <SpotlightCardFace
          data={data}
          svgComponent={SVGComponent}
          svgSize={svgSize}
          isReversed={isReversed}
        />
      ) : (
        /* 网格模式：使用3D翻牌动画 */
        <motion.div
          animate={{
            rotateY: isSelected ? 180 : 0,
          }}
          transition={{
            rotateY: { duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] },
          }}
          className="relative w-full h-full rounded-xl"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ---- 卡背 ---- */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* 玻璃态磨砂卡背 */}
            <div className="tarot-card-glass w-full h-full flex flex-col items-center justify-center">
              <div className="tarot-back-border w-[calc(100%-10px)] h-[calc(100%-10px)] flex flex-col items-center justify-center">
                <div className="tarot-back-diamond" />
                <div className="tarot-back-star top-left" />
                <div className="tarot-back-star top-right" />
                <div className="tarot-back-star bottom-left" />
                <div className="tarot-back-star bottom-right" />
              </div>
            </div>
          </div>

          {/* ---- 卡面（翻转后可见）---- */}
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `linear-gradient(165deg, ${CARD_COLORS.background} 0%, ${CARD_COLORS.backgroundLight} 100%)`,
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              padding: 6,
            }}
          >
            <div className="flex items-center justify-center w-full flex-1">
              {SVGComponent && (
                <SVGComponent size={svgSize} className="relative z-10" />
              )}
            </div>
            <div className="w-full flex flex-col items-center pb-1">
              {isReversed && (
                <span className="text-[9px] text-red-400/70 tracking-wider">
                  逆位
                </span>
              )}
              <span className={`text-[9px] ${CARD_COLORS.gold} opacity-50 font-serif tracking-widest`}>
                {ROMAN[data.id]}
              </span>
              <span className="font-serif leading-tight text-[10px] text-amber-100">
                {data.name}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================
// SpotlightCardFace —— 聚光灯模式专用卡面组件
// 直接显示大阿卡纳 SVG 艺术图案，无需翻转动画
// ============================================================
function SpotlightCardFace({
  data,
  svgComponent,
  svgSize,
  isReversed = false,
}: {
  data: TarotCardData;
  svgComponent: React.ComponentType<{ size: number; className?: string }> | undefined;
  svgSize: number;
  isReversed?: boolean;
}): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full h-full rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(165deg, ${CARD_COLORS.background}dd 0%, ${CARD_COLORS.backgroundLight}dd 100%)`,
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(180, 145, 40, 0.5)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 0 30px rgba(212,175,55,0.2)',
        padding: 16,
      }}
    >
      {/* 聚光灯效果背景 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 60%)',
        }}
      />

      {/* SVG 图案区域 - 占卡面上部大部分空间 */}
      <div className="flex items-center justify-center w-full flex-1">
        {svgComponent && (
          <div className="relative">
            {/* SVG 外围微光效果 */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)`,
                transform: 'scale(1.4)',
                filter: 'blur(15px)',
              }}
            />
            {(() => {
              const Component = svgComponent;
              return <Component size={svgSize} className="relative z-10" />;
            })()}
          </div>
        )}
      </div>

      {/* 底部信息区域 */}
      <div className="w-full flex flex-col items-center pb-2 mt-auto">
        {isReversed && (
          <span className="text-xs text-red-400/70 tracking-wider mb-1">
            逆位
          </span>
        )}
        <span className="text-[10px] text-amber-100/40 font-serif tracking-widest">
          {ROMAN[data.id]}
        </span>
        <span className={`font-serif text-sm mt-1 ${
          isReversed ? 'text-red-200/80' : 'text-amber-100'
        }`}>
          {data.name}
        </span>
      </div>
    </motion.div>
  );
}
