import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from '../components/Tarot/TarotCard';
import { MAJOR_ARCANA, type TarotCardData } from '../constants/tarotData';

export default function TarotSelectPage() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [question, setQuestion] = useState('');

  const cards: TarotCardData[] = MAJOR_ARCANA;

  useEffect(() => {
    // 从 localStorage 获取问题
    const storedQuestion = localStorage.getItem('tarotQuestion');
    if (storedQuestion) {
      setQuestion(storedQuestion);
    }
  }, []);

  const handleSelect = useCallback((index: number) => {
    if (selectedIndex !== null) return; // 防止重复选择
    setSelectedIndex(index);
  }, [selectedIndex]);

  const handleConfirm = useCallback(() => {
    if (selectedIndex !== null) {
      setShowInterpretation(true);
    }
  }, [selectedIndex]);

  // 跳转到解读页
  useEffect(() => {
    if (showInterpretation && selectedIndex !== null) {
      const card = cards[selectedIndex];
      navigate(`/tarot-interpret/${card.id}`);
    }
  }, [showInterpretation, selectedIndex, cards, navigate]);

  const handleBack = () => {
    navigate('/tarot-question');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      {/* 返回入口 */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-6 z-20 text-amber-100/40 hover:text-amber-100/70 text-sm tracking-wider transition-colors duration-300"
      >
        ← 虚空
      </motion.a>

      {/* 顶部问题区域 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center pt-12 pb-6"
      >
        <p className="text-amber-100/50 text-xs tracking-widest mb-2">你问的是</p>
        <h2 className="text-amber-100/80 text-lg md:text-xl font-light italic max-w-xl mx-auto px-4">
          "{question || '...'}"
        </h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent mx-auto mt-4" />
      </motion.div>

      {/* 卡牌网格区域 - 中下位置 */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-[calc(100vh-180px)] pb-12 px-4">
        {/* 选择提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedIndex === null ? 1 : 0 }}
          className="text-amber-100/40 text-sm tracking-wider mb-6"
        >
          选择一张牌
        </motion.p>

        {/* 卡牌网格 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl"
        >
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4 justify-items-center">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.02 }}
                className={selectedIndex !== null && selectedIndex !== index ? 'opacity-30 scale-95' : ''}
              >
                <TarotCard
                  data={card}
                  isSelected={selectedIndex === index}
                  onClick={() => handleSelect(index)}
                  disabled={selectedIndex !== null && selectedIndex !== index}
                  compact={true}
                  size="small"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 确认按钮 */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <p className="text-amber-100/60 text-sm">
                你选择了 <span className="text-amber-100 font-medium">{cards[selectedIndex]?.name}</span>
              </p>
              <motion.button
                onClick={handleConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gradient-to-r from-amber-900/40 to-amber-800/30 text-amber-100 border border-amber-700/40 rounded-lg font-medium tracking-wider hover:from-amber-900/50 hover:to-amber-800/40 transition-all duration-300"
              >
                确认解读
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 重新输入 */}
        <motion.button
          onClick={handleBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-amber-100/30 hover:text-amber-100/50 text-xs tracking-wider transition-colors duration-300"
        >
          重新输入问题
        </motion.button>
      </div>
    </div>
  );
}
