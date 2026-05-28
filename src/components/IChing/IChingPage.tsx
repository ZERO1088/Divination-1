import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { playShakeSound, playLandingSound } from '../../utils/ichingSounds';
import { getHexagramByLines } from '../../utils/ichingLogic';
import { useAI } from '../../hooks/useDeepSeek';
import { buildIChingPrompt, cleanMarkdown, ICHING_SYSTEM_PROMPT } from '../../utils/api';
import { useAppContext } from '../../context/AppContext';

// 标准化爻线样式组件
const StandardHexagramLine = ({
  type,
  isChanging,
  isRevealed,
  delay = 0,
  lineIndex = 0,
}: {
  type: 'yang' | 'yin';
  isChanging: boolean;
  isRevealed: boolean;
  delay?: number;
  lineIndex?: number;
}) => {
  const yaoNames = ['初', '二', '三', '四', '五', '上'];
  const yaoName = yaoNames[lineIndex] || '';
  
  return (
    <motion.div
      className="relative h-10 flex items-center justify-center gap-4"
      initial={{ opacity: 0, scaleX: 0 }}
      animate={isRevealed ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
      transition={{ duration: 0.2, delay: isRevealed ? delay : 0, ease: 'easeOut' }}
    >
      {/* 爻位标注 */}
      <span className="w-6 text-amber-700/60 text-xs text-right font-serif">
        {yaoName}
      </span>
      
      {/* 爻线容器 */}
      <div className="relative w-40 h-1.5">
        {type === 'yang' ? (
          /* 阳爻：完整横线 */
          <div className={`absolute inset-0 rounded-full ${
            isChanging 
              ? 'bg-gradient-to-r from-red-800 via-red-600 to-red-800 shadow-[0_0_8px_rgba(220,38,38,0.4)]' 
              : 'bg-amber-700/90'
          }`}>
            {/* 动爻发光效果 */}
            {isChanging && (
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/30"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        ) : (
          /* 阴爻：两段对称短线 */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-[calc(50%-16px)] h-1.5 rounded-full ${
              isChanging 
                ? 'bg-gradient-to-r from-red-800 to-red-600 shadow-[0_0_6px_rgba(220,38,38,0.4)]' 
                : 'bg-amber-700/90'
            }`} />
            <div className={`w-[calc(50%-16px)] h-1.5 rounded-full ${
              isChanging 
                ? 'bg-gradient-to-l from-red-800 to-red-600 shadow-[0_0_6px_rgba(220,38,38,0.4)]' 
                : 'bg-amber-700/90'
            }`} />
            {/* 动爻发光效果 */}
            {isChanging && (
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                animate={{ opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        )}
      </div>
      
      {/* 爻类型标注 */}
      <span className="w-12 text-xs text-right font-serif">
        {type === 'yang' ? (isChanging ? '老阳' : '少阳') : (isChanging ? '老阴' : '少阴')}
      </span>
    </motion.div>
  );
};

// 乾隆通宝铜钱 SVG - 正面"乾"字，背面太极阴阳
const QianlongCoin = ({ shaking = false, showFront = true }: {
  shaking?: boolean;
  showFront?: boolean;
}) => {
  return (
    <motion.div
      animate={shaking ? {
        rotate: [0, -25, 25, -18, 18, -10, 10, 0],
        y: [0, -20, 0],
        scale: [1, 1.08, 1],
      } : {}}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="relative"
    >
      <svg width="52" height="52" viewBox="0 0 52 52" className="drop-shadow-lg">
        {/* 外圈 - 古铜色 */}
        <circle cx="26" cy="26" r="24" fill="#7A5C1E" stroke="#C9A961" strokeWidth="2" />
        <circle cx="26" cy="26" r="21" fill="none" stroke="#A08040" strokeWidth="1" />
        
        {/* 正面：乾字 - 三才者天地人 */}
        {showFront ? (
          <>
            <text x="26" y="18" textAnchor="middle" fill="#C9A961" fontSize="12" fontFamily="'Noto Serif SC', serif" fontWeight="bold">乾</text>
            <text x="26" y="30" textAnchor="middle" fill="#C9A961" fontSize="7" fontFamily="'Noto Serif SC', serif">三才者</text>
            <text x="26" y="40" textAnchor="middle" fill="#C9A961" fontSize="7" fontFamily="'Noto Serif SC', serif">天地人</text>
          </>
        ) : (
          /* 背面：太极阴阳 */
          <>
            <circle cx="26" cy="26" r="15" fill="#5A4010" stroke="#C9A961" strokeWidth="1" />
            <circle cx="26" cy="26" r="10" fill="none" stroke="#C9A961" strokeWidth="0.5" />
            {/* 太极鱼 */}
            <path d="M26,16 A10,10 0 0,1 26,36 A5,5 0 0,0 26,16" fill="#C9A961" />
            <path d="M26,36 A10,10 0 0,1 26,16 A5,5 0 0,0 26,36" fill="#5A4010" stroke="#C9A961" strokeWidth="0.5" />
            <circle cx="26" cy="21" r="2" fill="#5A4010" />
            <circle cx="26" cy="31" r="2" fill="#C9A961" />
          </>
        )}
        
        {/* 内圈装饰 */}
        <circle cx="26" cy="26" r="18" fill="none" stroke="#A08040" strokeWidth="0.5" strokeDasharray="1 2" />
        
        {/* 金属光泽 */}
        <defs>
          <linearGradient id="coinShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r="24" fill="url(#coinShine)" />
      </svg>
    </motion.div>
  );
};

// 擦灰动效组件
const RevealOverlay = ({ 
  isRevealed, 
  children 
}: { 
  isRevealed: boolean; 
  children: React.ReactNode;
}) => {
  return (
    <div className="relative h-full">
      {/* 擦灰层 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 z-10 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={isRevealed ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      
      {/* 内容 */}
      <motion.div
        className="relative z-0"
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// AI解读按钮
const ActionButtons = ({ 
  onRequestion, 
  onAIInterpret,
  isGenerating = false,
}: { 
  onRequestion: () => void;
  onAIInterpret: () => void;
  isGenerating?: boolean;
}) => (
  <div className="flex gap-4 pt-6">
    <button
      type="button"
      onClick={onRequestion}
      disabled={isGenerating}
      className="flex-1 py-3 rounded-sm bg-gradient-to-b from-amber-900/40 to-amber-950/60 border border-amber-700/40 text-amber-600 font-serif text-sm tracking-wider hover:border-amber-600/60 hover:shadow-[0_0_15px_rgba(201,169,97,0.15)] transition-all disabled:opacity-50"
    >
      重新提问
    </button>
    <button
      type="button"
      onClick={onAIInterpret}
      disabled={isGenerating}
      className="flex-1 py-3 rounded-sm bg-gradient-to-b from-red-900/40 to-red-950/60 border border-red-800/40 text-red-600 font-serif text-sm tracking-wider hover:border-red-700/60 hover:shadow-[0_0_15px_rgba(220,38,38,0.15)] transition-all disabled:opacity-50"
    >
      {isGenerating ? '生成中...' : 'AI 专业解读'}
    </button>
  </div>
);

export default function IChingPage() {
  const navigate = useNavigate();
  const { question } = useAppContext(); // 从全局 context 获取问题
  const [phase, setPhase] = useState<'idle' | 'throwing' | 'revealing' | 'completed'>('idle');
  const [lines, setLines] = useState<(number | null)[]>([null, null, null, null, null, null]);
  const [coinResults, setCoinResults] = useState<('yang' | 'yin' | null)[]>([]);
  // 标记为有意不使用，但保留 setter 供内部逻辑使用
  void coinResults;
  const [currentThrow, setCurrentThrow] = useState(0);
  const [hexagram, setHexagram] = useState<ReturnType<typeof getHexagramByLines> | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // AI 解读 hook
  const { state: aiState, result: aiResult, error: aiError, analyze: analyzeAI } = useAI();

  const isAnimating = phase === 'throwing' || phase === 'revealing';
  const revealedLines = lines.filter(l => l !== null).length;
  const isCompleted = phase === 'completed';

  // 检查是否有未完成的占卜（防止浏览器返回）
  useEffect(() => {
    const savedState = sessionStorage.getItem('ichingDivinationState');
    if (savedState && lines.some(l => l !== null)) {
      setShowConfirmModal(true);
    }
  }, []);

  // 保存占卜状态到 sessionStorage
  useEffect(() => {
    if (lines.some(l => l !== null)) {
      sessionStorage.setItem('ichingDivinationState', JSON.stringify({ lines, phase }));
    }
  }, [lines, phase]);

  // 继续当前占卜
  const handleContinue = () => {
    setShowConfirmModal(false);
  };

  // 重新开始占卜
  const handleRestart = () => {
    sessionStorage.removeItem('ichingDivinationState');
    setLines([null, null, null, null, null, null]);
    setCoinResults([null, null, null]);
    setCurrentThrow(0);
    setPhase('idle');
    setAiInterpretation('');
    setShowConfirmModal(false);
  };

  // 卦象完成时播放音效
  useEffect(() => {
    if (phase === 'completed') {
      playLandingSound();
    }
  }, [phase]);

  // 摇卦
  const handleThrow = useCallback(() => {
    if (isAnimating || currentThrow >= 6) return;
    setPhase('throwing');
    playShakeSound();
    
    // 生成三枚铜钱的结果
    const results: ('yang' | 'yin')[] = [
      Math.random() < 0.5 ? 'yang' : 'yin',
      Math.random() < 0.5 ? 'yang' : 'yin', 
      Math.random() < 0.5 ? 'yang' : 'yin',
    ];
    
    // 计算这一爻的结果 (3个阳=老阳(9), 3个阴=老阴(6), 2阳1阴=少阳(7), 2阴1阳=少阴(8))
    const yangCount = results.filter(r => r === 'yang').length;
    let lineValue: number;
    
    if (yangCount === 3) {
      lineValue = 9; // 老阳
    } else if (yangCount === 0) {
      lineValue = 6; // 老阴
    } else if (yangCount === 2) {
      lineValue = 7; // 少阳
    } else {
      lineValue = 8; // 少阴
    }
    
    setCoinResults(results);
    
    setTimeout(() => {
      const newLines = [...lines];
      newLines[currentThrow] = lineValue;
      setLines(newLines);
      setPhase('revealing');
      
      setTimeout(() => {
        const nextThrow = currentThrow + 1;
        setCurrentThrow(nextThrow);
        
        if (nextThrow >= 6) {
          // 计算卦象
          const numericLines = newLines.map(l => l as number);
          const hex = getHexagramByLines(numericLines);
          setHexagram(hex);
          setPhase('completed');
        } else {
          setPhase('idle');
          setCoinResults([]);
        }
      }, 400);
    }, 600);
  }, [isAnimating, currentThrow, lines]);

  // 重新开始
  const handleReset = useCallback(() => {
    setLines([null, null, null, null, null, null]);
    setCoinResults([]);
    setCurrentThrow(0);
    setHexagram(null);
    setPhase('idle');
    setAiInterpretation('');
    setIsGeneratingAI(false);
  }, []);

  // 重新提问
  const handleRequestion = useCallback(() => {
    handleReset();
    localStorage.removeItem('ichingQuestion');
    navigate('/iching-question');
  }, [handleReset, navigate]);

  // AI 解读
  const handleAIInterpretation = useCallback(async () => {
    if (isGeneratingAI || !hexagram) return;
    setIsGeneratingAI(true);
    setAiInterpretation('');

    // 构建爻辞字符串
    const linesDesc = hexagram.lines?.length 
      ? hexagram.lines.map((line, i) => `${['初', '二', '三', '四', '五', '上'][i]}：${line}`).join('\n')
      : '';

    // 构建六爻解读 prompt（使用精简模板）
    const prompt = buildIChingPrompt({
      originalName: `${hexagram.upperTrigram}${hexagram.lowerTrigram}卦·${hexagram.name}`,
      originalDesc: hexagram.description,
      originalLines: linesDesc,
      question,
    });

    // 调用 AI（传入 system prompt）
    await analyzeAI(prompt, 'iching', undefined, ICHING_SYSTEM_PROMPT);

    setIsGeneratingAI(false);
  }, [isGeneratingAI, hexagram, question, analyzeAI]);

  // 监听 AI 结果
  useEffect(() => {
    if (aiState === 'success' && aiResult) {
      setAiInterpretation(cleanMarkdown(aiResult.content));
    } else if (aiState === 'error' && aiError) {
      setAiInterpretation(`解读失败：${aiError.message}`);
    }
  }, [aiState, aiResult, aiError]);

  // 获取动爻索引
  const changingIndices = useMemo(() => {
    if (!hexagram) return [];
    return lines
      .map((line, idx) => (line === 6 || line === 9) ? idx : -1)
      .filter((idx) => idx !== -1);
  }, [hexagram, lines]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100 font-serif relative overflow-hidden">
      {/* 八卦暗纹背景 */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A961' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* 返回入口 */}
      <motion.button
        type="button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed top-4 left-4 z-50 group"
      >
        <span className="text-amber-700/50 group-hover:text-amber-600 text-xs tracking-widest transition-colors duration-300">
          ← 虚空
        </span>
      </motion.button>

      {/* 确认重新占卜模态框 */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-stone-900/95 border border-amber-800/30 rounded-lg p-6 max-w-sm mx-4 text-center"
            >
              <h3 className="text-amber-600 text-lg mb-4">检测到已有占卜</h3>
              <p className="text-stone-300 text-sm mb-6">
                您之前有一卦尚未完成或已解读完毕。
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
                >
                  重新占卜
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors"
                >
                  继续当前
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================
          左右分栏主布局
          ================================================================ */}
      <div className="flex flex-col lg:flex-row">
        
        {/* ================================================================
            左侧：铜钱 + 卦象区（桌面端固定，右侧独立滚动）
            ================================================================ */}
        <div className={`flex flex-col items-center justify-start pt-20 pb-8 px-4 transition-all duration-700 lg:sticky lg:top-0 lg:h-screen lg:w-[45%] lg:overflow-hidden lg:shrink-0 ${
          isCompleted ? '' : 'w-full'
        }`}>
          
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-xl text-amber-600/80 tracking-[0.3em]">
              六爻占卜
            </h1>
            {question && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-amber-800/60 text-sm max-w-md"
              >
                「{question}」
              </motion.p>
            )}
          </motion.div>

          {/* ================================================================
              铜钱区域
              ================================================================ */}
          <motion.div
            className="flex items-center justify-center gap-6 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={
                  phase === 'throwing'
                    ? {
                        rotate: [0, -30, 30, -20, 20, -10, 10, 0],
                        y: [0, -25, 0],
                        scale: [1, 1.1, 1],
                      }
                    : phase === 'revealing'
                    ? { rotate: 0, scale: [1, 1.15, 1] }
                    : {}
                }
                transition={
                  phase === 'throwing'
                    ? { duration: 0.5, ease: 'easeInOut' }
                    : phase === 'revealing'
                    ? { duration: 0.3 }
                    : { duration: 0.3 }
                }
              >
                <QianlongCoin 
                  shaking={phase === 'throwing'}
                  showFront={phase === 'revealing' || phase === 'completed'}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* 进度指示 */}
          <motion.div
            className="text-amber-700/60 text-sm py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            第 {revealedLines} / 6 爻
          </motion.div>

          {/* ================================================================
              六爻卦象区域 - 标准化爻线
              ================================================================ */}
          <motion.div
            className="w-full max-w-md px-4 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col gap-1">
              {/* 从上往下显示（上爻在顶，初爻在底） */}
              {[5, 4, 3, 2, 1, 0].map((lineIndex) => {
                const line = lines[lineIndex];
                const isRevealed = line !== null;
                const isLineChanging = line === 9 || line === 6; // 老阳(9)或老阴(6)为动爻
                const type = (line === 7 || line === 9) ? 'yang' : 'yin';
                
                return (
                  <StandardHexagramLine
                    key={lineIndex}
                    type={type}
                    isChanging={isLineChanging && isRevealed}
                    isRevealed={isRevealed}
                    delay={0.05}
                    lineIndex={lineIndex}
                  />
                );
              })}
            </div>
            
            {/* 卦名显示（完成后） */}
            <AnimatePresence>
              {hexagram && isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-6 pt-4 border-t border-amber-800/20"
                >
                  <h2 className="text-2xl text-amber-500 tracking-[0.2em]">
                    {hexagram.name}
                  </h2>
                  <p className="mt-1 text-amber-800/60 text-sm">
                    {hexagram.upperTrigram}{hexagram.lowerTrigram} · 第{hexagram.id}卦
                  </p>
                  {changingIndices.length > 0 && (
                    <p className="mt-1 text-red-700/60 text-xs">
                      动爻：{changingIndices.map(i => ['初', '二', '三', '四', '五', '上'][i]).join('、')}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ================================================================
              摇卦按钮（未完成时）
              ================================================================ */}
          {!isCompleted && (
            <motion.div
              className="py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={handleThrow}
                disabled={phase === 'throwing' || isAnimating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-10 py-3 rounded-sm bg-gradient-to-b from-amber-900/40 to-amber-950/60 border border-amber-700/40 text-amber-600 tracking-[0.2em] transition-all duration-300 hover:border-amber-600/60 hover:shadow-[0_0_20px_rgba(201,169,97,0.15)] disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
              >
                {phase === 'throwing' ? '摇卦中...' : '摇卦'}
              </motion.button>
            </motion.div>
          )}

          {/* 重新起卦（完成后） */}
          {isCompleted && (
            <motion.div
              className="py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="button"
                onClick={handleReset}
                className="text-amber-800/50 text-sm hover:text-amber-600 transition-colors"
              >
                重新起卦
              </button>
            </motion.div>
          )}
        </div>

        {/* ================================================================
            右侧：解读区域（擦灰动效）
            ================================================================ */}
        <div className={`w-full lg:w-[55%] min-h-[50vh] lg:min-h-screen border-t lg:border-t-0 lg:border-l border-amber-900/20 transition-all duration-700 ${
          isCompleted ? 'lg:block' : 'hidden lg:block'
        }`}>
          <RevealOverlay isRevealed={isCompleted}>
            <div className="p-6 lg:p-10 h-full flex flex-col">
              
              {/* 卦辞 */}
              {hexagram && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="bg-stone-900/50 border border-amber-800/30 rounded-sm p-6">
                    <p className="text-amber-700/90 text-sm leading-relaxed text-center font-serif">
                      「{hexagram.description}」
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 解读内容 */}
              {hexagram && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 bg-amber-950/20 border border-amber-800/20 rounded-sm p-6 space-y-4 overflow-auto"
                >
                  <div>
                    <p className="text-amber-700/70 text-sm mb-2">卦辞今译</p>
                    <p className="text-amber-900/80 text-sm leading-relaxed font-serif">{hexagram.popularDescription}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-amber-800/20">
                    <p className="text-amber-700/70 text-sm mb-2">爻辞</p>
                    <div className="space-y-2">
                      {hexagram.lines.map((line: string, i: number) => (
                        <p key={i} className="text-amber-900/70 text-xs leading-relaxed font-serif">
                          【{['初', '二', '三', '四', '五', '上'][i]}爻】{line}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI 解读结果 */}
              {(isGeneratingAI || aiState === 'loading') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-red-950/20 border border-red-800/30 rounded-sm p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 border border-red-700/50 border-t-red-500/80 rounded-full animate-spin" />
                    <p className="text-red-700/70 text-xs font-serif">
                      命运正在揭示中...
                    </p>
                  </div>
                </motion.div>
              )}
              {aiInterpretation && !isGeneratingAI && aiState !== 'loading' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 bg-red-950/20 border border-red-800/30 rounded-sm p-4"
                >
                  <p className="text-red-700/80 text-xs leading-relaxed font-serif whitespace-pre-wrap">
                    {aiInterpretation}
                  </p>
                </motion.div>
              )}

              {/* 底部按钮 */}
              {isCompleted && (
                <ActionButtons 
                  onRequestion={handleRequestion}
                  onAIInterpret={handleAIInterpretation}
                  isGenerating={isGeneratingAI}
                />
              )}
            </div>
          </RevealOverlay>
        </div>
      </div>
    </div>
  );
}
