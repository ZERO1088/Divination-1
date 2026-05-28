import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TarotCard } from '../components/Tarot/TarotCard';
import { MAJOR_ARCANA } from '../constants/tarotData';
import { useDeepSeek } from '../hooks/useDeepSeek';
import { buildTarotPrompt, cleanMarkdown } from '../utils/api';

export default function TarotInterpretPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [isReversed, setIsReversed] = useState(false);
  const [showAIInterpretation, setShowAIInterpretation] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { state: aiState, result: aiResult, error: aiError, analyze } = useDeepSeek({
    timeoutMs: 30000,
  });

  const card = MAJOR_ARCANA.find((c) => c.id === Number(cardId));

  // 检查是否有已解读的牌（防止浏览器返回）
  useEffect(() => {
    const savedState = sessionStorage.getItem('tarotInterpretState');
    if (savedState && showAIInterpretation) {
      setShowConfirmModal(true);
    }
  }, []);

  // 保存解读状态到 sessionStorage
  useEffect(() => {
    if (showAIInterpretation) {
      sessionStorage.setItem('tarotInterpretState', 'interpreted');
    }
  }, [showAIInterpretation]);

  useEffect(() => {
    const storedQuestion = localStorage.getItem('tarotQuestion');
    if (storedQuestion) {
      setQuestion(storedQuestion);
    }
    // 随机决定正逆位
    setIsReversed(Math.random() > 0.6);
  }, [cardId]);

  // 继续当前解读
  const handleContinue = () => {
    setShowConfirmModal(false);
  };

  // 重新选牌
  const handleRestart = () => {
    sessionStorage.removeItem('tarotInterpretState');
    sessionStorage.removeItem('tarotSelectedCard');
    navigate('/tarot-select');
  };

  const handleAIInterpretation = async () => {
    if (!card || !question) return;

    setShowAIInterpretation(true);

    // 使用统一的 prompt 模板（省 Token）
    const prompt = buildTarotPrompt({
      cardName: card.name,
      cardNameEn: card.nameEn,
      isReversed,
      meaning: isReversed ? card.reversedMeaning : card.meaning,
      question,
    });

    await analyze(prompt, 'tarot', {
      cardName: card.name,
      isReversed,
      question,
    });
  };

  if (!card) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-amber-100/50">卡牌不存在</p>
      </div>
    );
  }

  const displayKeywords = (isReversed ? card.reversedKeywords : card.keywords).split('、');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-amber-50/90 flex flex-col">
      {/* 顶部导航 - 仅保留标题 */}
      <div className="w-full px-6 py-5 flex items-center justify-center border-b border-amber-900/20">
        <h1 className="font-serif text-amber-100/70 text-base tracking-widest">塔罗解读</h1>
      </div>

      {/* 确认重新选牌模态框 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-stone-900/95 border border-amber-800/30 rounded-lg p-6 max-w-sm mx-4 text-center">
            <h3 className="text-amber-600 text-lg mb-4">检测到已有解读</h3>
            <p className="text-stone-300 text-sm mb-6">
              您之前的塔罗牌解读尚未完成。
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
              >
                重新选牌
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors"
              >
                继续当前
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex items-stretch lg:overflow-hidden">
        {/* 左侧卡牌区（桌面端固定） */}
        <div className="w-2/5 flex items-center justify-center p-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          <div className="relative">
            {/* 聚光效果 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 120% 100% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
              }}
            />
            <TarotCard
              data={card}
              isSelected={true}
              onClick={() => {}}
              disabled={false}
              spotlight={true}
              isReversed={isReversed}
            />
          </div>
        </div>

        {/* 右侧解读区 */}
        <div className="w-3/5 p-10 flex flex-col">
          {/* 问题摘要 */}
          {question && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-amber-100/40 text-xs uppercase tracking-widest mb-2">你问的是</p>
              <p className="text-amber-50/80 text-lg font-light leading-relaxed italic">
                「{question}」
              </p>
            </motion.div>
          )}

          {/* 牌名 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className={`font-serif text-3xl tracking-wider ${isReversed ? 'text-red-200/80' : 'text-amber-100'}`}>
              {isReversed ? card.name : card.name}
            </p>
            <p className="text-amber-100/40 text-sm mt-1">{card.nameEn}</p>
            {isReversed && (
              <span className="inline-block mt-2 text-xs text-red-400/60 border border-red-400/30 px-2 py-0.5 rounded">
                逆位
              </span>
            )}
          </motion.div>

          {/* 关键词 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-amber-100/40 text-xs uppercase tracking-widest mb-3">
              {isReversed ? '逆位关键词' : '正位关键词'}
            </p>
            <div className="flex flex-wrap gap-2">
              {displayKeywords.map((keyword: string, i: number) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isReversed
                      ? 'bg-red-900/20 text-red-200/70 border border-red-400/20'
                      : 'bg-amber-900/20 text-amber-100/70 border border-amber-400/20'
                  }`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 牌意解读 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 flex-1"
          >
            <p className="text-amber-100/40 text-xs uppercase tracking-widest mb-3">牌意解读</p>
            <p className="text-amber-50/70 leading-loose font-light">
              {isReversed ? card.reversedMeaning : card.meaning}
            </p>
          </motion.div>

          {/* AI 解读区域 */}
          {showAIInterpretation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 bg-amber-900/5 border border-amber-900/20 rounded-lg"
            >
              <p className="text-amber-100/60 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full" />
                专业 AI 解读
              </p>

              {aiState === 'loading' && (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-4 h-4 border border-amber-400/30 border-t-amber-400/80 rounded-full animate-spin" />
                  <p className="text-amber-100/50 text-sm">AI 正在解读...</p>
                </div>
              )}

              {aiState === 'success' && aiResult && (
                <div className="text-amber-50/70 leading-relaxed font-light whitespace-pre-wrap">
                  {cleanMarkdown(aiResult.content)}
                </div>
              )}

              {aiState === 'error' && aiError && (
                <div className="text-red-400/70 text-sm py-2">
                  解读失败：{aiError.message}
                </div>
              )}
            </motion.div>
          )}

          {/* 底部操作 - 两个并排按钮 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-6 border-t border-amber-900/20"
          >
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/tarot-question')}
                className="flex-1 py-3 text-amber-100/60 hover:text-amber-100 transition-colors text-sm border border-amber-900/20 hover:border-amber-700/30 rounded-lg hover:bg-amber-900/10"
              >
                重新提问
              </button>
              <button
                onClick={handleAIInterpretation}
                disabled={aiState === 'loading'}
                className="flex-1 py-3 text-amber-100/80 hover:text-amber-100 transition-colors text-sm border border-amber-700/30 hover:border-amber-500/50 rounded-lg hover:bg-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-900/10 to-amber-800/5"
              >
                {aiState === 'loading' ? '解读中...' : '专业 AI 解读'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
