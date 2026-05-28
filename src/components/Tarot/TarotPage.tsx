// ============================================================
// TarotPage —— 塔罗命运舞台
// 半圆命运之环 + 仪式感抽牌流程
// ============================================================

import { type ReactNode, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTarot } from '../../hooks/useTarot';
import { useDeepSeek } from '../../hooks/useDeepSeek';
import { useAppContext } from '../../context/AppContext';
import { buildTarotPrompt, stripMarkdown } from '../../utils/api';
import { TarotCard } from './TarotCard';
import { CardReveal } from './CardReveal';
import { QuestionInput } from '../common/QuestionInput';
import { BreathingDots } from '../common/BreathingDots';

// ============================================================
// 命运之环配置 (REFINED)
// 电脑端优雅氛围感 / 手机端实用易操作
// ============================================================

interface CardPosition {
  cardData: ReturnType<typeof useTarot>['shuffledCards'][0];
  angle: number;       // 弧度
  radius: number;      // 距离中心的像素半径
  index: number;       // 在数组中的原始索引
}

const RING_RADIUS = 450;           // 命运之环半径（扩大）
const CENTER_X = 50;               // 中心 X (百分比)
const CENTER_Y = 50;               // 中心 Y (百分比)

// 响应式配置 - 电脑端优雅 / 手机端实用
const getLayoutConfig = (isMobile: boolean) => ({
  // 模式选择
  isMobile,
  
  // 半径
  radius: isMobile ? 180 : RING_RADIUS,
  
  // 弧度范围：电脑端更舒展
  arcSpan: isMobile ? Math.PI * 0.65 : Math.PI * 0.95,
  
  // 卡片尺寸
  cardSize: isMobile ? 72 : 100,
  
  // 间距因子：电脑端更宽松
  spacingFactor: isMobile ? 2.5 : 1.6,
  
  // 垂直偏移：电脑端更大气
  verticalSpread: isMobile ? 15 : 38,
  
  // 手机端网格列数
  gridCols: isMobile ? 4 : 0,
});

// 计算卡片在命运之环上的位置
function calculateCardPositions(
  cards: ReturnType<typeof useTarot>['shuffledCards'],
  isMobile: boolean
): CardPosition[] {
  const count = cards.length;
  const config = getLayoutConfig(isMobile);
  
  // 半圆：从 180° 到 360°（左到右）
  const startAngle = Math.PI; // 180°
  const endAngle = startAngle + config.arcSpan; // 动态弧度
  const angleStep = count > 1 ? (endAngle - startAngle) / (count - 1) : 0;

  return cards.map((cardData, index) => {
    const angle = startAngle + index * angleStep;
    // 稍微调整半径，让环不是完美圆形而更有张力
    const radiusVariation = Math.sin(angle - Math.PI) * 20;
    const radius = config.radius + radiusVariation;

    return {
      cardData,
      angle,
      radius,
      index,
    };
  });
}

// 根据距离中心的距离计算视觉参数
function getDistanceFactor(position: CardPosition, isMobile: boolean): number {
  const config = getLayoutConfig(isMobile);
  const maxRadius = config.radius + 20;
  const minRadius = config.radius - 20;
  const normalized = (position.radius - minRadius) / (maxRadius - minRadius);
  return Math.abs(Math.sin(position.angle - Math.PI)) * 0.3 + normalized * 0.7;
}

// ============================================================
// TarotPage
// ============================================================

export default function TarotPage(): ReactNode {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // 检测移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const {
    phase,
    selectedCard,
    selectedIndex,
    shuffledCards,
    selectCard,
    reset: resetTarot,
  } = useTarot();
  const { question } = useAppContext();
  const {
    state: aiState,
    result: aiResult,
    error: aiError,
    analyze,
    reset: resetAI,
  } = useDeepSeek({
    timeoutMs: 30000,
  });

  // 计算命运之环位置（响应式）
  const ringPositions = useMemo(() => {
    return calculateCardPositions(shuffledCards, isMobile);
  }, [shuffledCards, isMobile]);
  
  // 响应式配置
  const layoutConfig = getLayoutConfig(isMobile);

  const handleAnalyze = useCallback(() => {
    if (!selectedCard) return;
    const prompt = buildTarotPrompt({
      cardName: selectedCard.name,
      cardNameEn: selectedCard.nameEn,
      isReversed: selectedCard.isReversed,
      meaning: selectedCard.isReversed
        ? selectedCard.reversedMeaning
        : selectedCard.meaning,
      question,
    });
    analyze(prompt, 'tarot', {
      cardName: selectedCard.name,
      isReversed: selectedCard.isReversed,
      question,
    });
  }, [selectedCard, question, analyze]);

  const handleReset = useCallback(() => {
    resetTarot();
    resetAI();
  }, [resetTarot, resetAI]);

  const handleCardSelect = useCallback((cardData: ReturnType<typeof useTarot>['shuffledCards'][0]) => {
    if (phase === 'idle') {
      selectCard(cardData);
    }
  }, [phase, selectCard]);

  const showSpotlight = phase === 'drawn';

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden fate-stage-bg"
    >
      {/* 返回入口 */}
      <motion.button
        type="button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-6 left-6 z-50 group"
        whileHover={{ opacity: 1 }}
      >
        <span className="text-stone-500/40 group-hover:text-purple-300/60 text-xs tracking-widest transition-colors duration-300">
          ← 虚空
        </span>
      </motion.button>

      {/* 标题区域 - 向上移动，给命运之环更多空间 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <h2 className="text-stone-400/60 text-xs tracking-[0.3em] mb-2">
          {phase === 'idle' ? '选择一张命运之牌' : '命运的揭示'}
        </h2>
      </motion.div>

      {/* 问题输入 */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
        <QuestionInput disabled={phase === 'drawn'} />
      </div>

      {/* ---- 命运之环层 ---- */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* 环中心指示 */}
        <div className="absolute pointer-events-none" style={{
          left: `${CENTER_X}%`,
          top: `${CENTER_Y}%`,
          transform: 'translate(-50%, -50%)',
        }}>
          <div className="w-2 h-2 rounded-full fate-glow opacity-30" />
        </div>

        {/* 电脑端：优雅弧形布局 */}
        {!isMobile && phase === 'idle' && ringPositions.map((pos, displayIdx) => {
          const isSelected = selectedIndex === pos.cardData.id;
          const distanceFactor = getDistanceFactor(pos, isMobile);
          
          // 计算卡片位置 - 更宽松的分布
          const x = CENTER_X + Math.cos(pos.angle) * (layoutConfig.spacingFactor * 16);
          const y = CENTER_Y + Math.sin(pos.angle) * layoutConfig.verticalSpread;
          
          // 卡片朝向
          const rotation = (pos.angle * 180 / Math.PI) - 90;

          return (
            <motion.div
              key={pos.cardData.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1 - distanceFactor * 0.4,
                scale: 1 - distanceFactor * 0.15,
              }}
              transition={{
                delay: displayIdx * 0.03,
                duration: 0.5,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                zIndex: Math.round((1 - distanceFactor) * 10 + 5),
              }}
              className="cursor-pointer"
              onClick={() => handleCardSelect(pos.cardData)}
              whileHover={{
                y: -8,
                scale: 1.08,
                opacity: 1,
                transition: { duration: 0.2 },
              }}
            >
              <TarotCard
                data={pos.cardData}
                isSelected={isSelected}
                onClick={() => handleCardSelect(pos.cardData)}
                disabled={false}
                dimmed={false}
                compact={false}
              />
            </motion.div>
          );
        })}

        {/* 手机端：网格/横向平铺布局 - 更易点击 */}
        {isMobile && phase === 'idle' && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-wrap justify-center items-center gap-3 px-4 py-8 overflow-y-auto max-h-full">
            {ringPositions.map((pos, displayIdx) => {
              const isSelected = selectedIndex === pos.cardData.id;
              
              return (
                <motion.div
                  key={pos.cardData.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: displayIdx * 0.025,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                  className="cursor-pointer flex-shrink-0"
                  onClick={() => handleCardSelect(pos.cardData)}
                  whileTap={{ scale: 0.95 }}
                >
                  <TarotCard
                    data={pos.cardData}
                    isSelected={isSelected}
                    onClick={() => handleCardSelect(pos.cardData)}
                    disabled={false}
                    dimmed={false}
                    compact={true}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- 舞台：聚光灯牌 + 侧翼面板 ---- */}
      <AnimatePresence>
        {showSpotlight && selectedCard && aiState === 'idle' && (
          <motion.div
            key="spotlight-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-20 flex items-center justify-center fate-spotlight"
          >
            <div className="absolute inset-0 fate-stage-mask" />

            {/* 中央聚焦的牌 */}
            <motion.div
              key={`spotlight-${selectedCard.id}`}
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                y: 100,
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10"
            >
              <div className="absolute inset-0 fate-card-glow opacity-50" />
              <TarotCard
                data={
                  shuffledCards.find((c) => c.id === selectedCard.id) ??
                  shuffledCards[0]
                }
                isSelected={true}
                onClick={() => {}}
                disabled={true}
                spotlight
              />
            </motion.div>

            {/* 右侧解读面板 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 max-w-sm"
            >
              <CardReveal
                name={selectedCard.name}
                nameEn={selectedCard.nameEn}
                isReversed={selectedCard.isReversed}
                keywords={selectedCard.keywords}
                meaning={
                  selectedCard.isReversed
                    ? selectedCard.reversedMeaning
                    : selectedCard.meaning
                }
                onAnalyze={handleAnalyze}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- AI Loading ---- */}
      <AnimatePresence>
        {phase === 'drawn' && aiState === 'loading' && (
          <motion.div
            key="ai-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center fate-stage-mask"
          >
            <BreathingDots text="正在感应你的问题……" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- AI 成功：命中句 + 渐进展开 ---- */}
      <AnimatePresence>
        {phase === 'drawn' && aiState === 'success' && aiResult && (
          <motion.div
            key="ai-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-30"
          >
            <DestinyProgressiveReveal
              content={stripMarkdown(aiResult.content)}
              model={aiResult.model}
              cardName={selectedCard?.name}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- AI 错误 ---- */}
      <AnimatePresence>
        {phase === 'drawn' && aiState === 'error' && (
          <motion.div
            key="ai-error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center fate-stage-mask"
          >
            <div className="max-w-md text-center px-6">
              <p className="text-amber-200/70 font-serif text-sm mb-3">
                请求异常
              </p>
              {aiError && (
                <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-400/10 text-red-300/80 mb-3">
                  {aiError.type === 'timeout'
                    ? '超时'
                    : aiError.type === 'network'
                      ? '网络错误'
                      : aiError.type === 'server'
                        ? '服务器错误'
                        : '未知错误'}
                </span>
              )}
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                {aiResult?.content ?? '玄机未显，请稍后再试'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="text-stone-500 text-sm hover:text-amber-200/70 transition-colors"
              >
                重新抽牌
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// 命中句 + 渐进展开 内联组件
// ============================================================

function DestinyProgressiveReveal({
  content,
  model,
  cardName,
  onReset,
}: {
  content: string;
  model?: string;
  cardName?: string;
  onReset: () => void;
}): ReactNode {
  const [viewPhase, setViewPhase] = useState<'destiny' | 'reading'>('destiny');

  const { destinyLine, sections } = useMemo(() => {
    const match = content.match(/^(.+?[。！？…])/);
    const line = match ? match[1] : content.slice(0, 30);
    const rest = match
      ? content.slice(match[0].length).trim()
      : content.slice(30).trim();

    const raw = rest
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    let secs: string[];
    if (raw.length === 0) {
      secs = [];
    } else if (raw.length === 1) {
      const sentences = raw[0].split(/(?<=[。！？…])/);
      const chunks: string[] = [];
      let buf = '';
      for (const s of sentences) {
        buf += s;
        if (buf.length > 80) {
          chunks.push(buf.trim());
          buf = '';
        }
      }
      if (buf.trim()) chunks.push(buf.trim());
      secs = chunks.length <= 1 ? raw : chunks;
    } else {
      secs = raw;
    }
    return { destinyLine: line, sections: secs };
  }, [content]);

  return (
    <div className="relative w-full min-h-screen fate-stage-bg">
      {/* 弱化牌名背景锚点 */}
      {cardName && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none">
          <p className="text-amber-200/[0.06] font-serif text-6xl tracking-widest blur-sm">
            {cardName}
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {viewPhase === 'destiny' && (
          <motion.div
            key="destiny"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(4px)', y: -20 }}
            transition={{ duration: 0.6 }}
            className="destiny-sentence flex flex-col items-center cursor-pointer"
            onClick={() => setViewPhase('reading')}
          >
            <DestinyTypewriter text={destinyLine} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="text-stone-500 text-sm mt-10 hover:text-amber-200/60 transition-colors"
            >
              ↓ 轻触展开全文
            </motion.p>
          </motion.div>
        )}

        {viewPhase === 'reading' && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="w-full max-w-[620px] mx-auto px-6 pt-32 pb-24"
          >
            <p className="text-amber-200/80 font-serif text-lg text-center mb-6">
              {destinyLine}
            </p>

            {sections.map((section, i) => (
              <ProgressiveSection
                key={i}
                text={section}
                index={i}
              />
            ))}

            {model && (
              <p className="text-stone-600 text-xs text-center mt-16">
                {model === 'demo' ? 'Demo 模式' : `模型：${model}`}
              </p>
            )}

            <div className="flex justify-center mt-12">
              <button
                type="button"
                onClick={onReset}
                className="text-stone-500 text-sm hover:text-amber-200/70 transition-colors"
              >
                重新抽牌
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressiveSection({
  text,
  index,
}: {
  text: string;
  index: number;
}): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
      className="text-stone-400 text-sm leading-relaxed mb-4 text-left"
    >
      {text}
    </motion.div>
  );
}

function DestinyTypewriter({ text }: { text: string }): ReactNode {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-amber-200/80 font-serif text-lg tracking-wide text-center px-8">
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
    </p>
  );
}
