import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TarotQuestionPage() {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // 将问题存储到 localStorage，供后续页面使用
      localStorage.setItem('tarotQuestion', question.trim());
      navigate('/tarot-select');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      {/* 装饰线条 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-amber-900/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent via-amber-900/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-amber-100/90 mb-4 tracking-wider">
            塔罗占卜
          </h1>
          <p className="text-amber-100/50 text-sm tracking-widest">
            TAROT DIVINATION
          </p>
        </motion.div>

        {/* 输入区域 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative"
        >
          {/* 装饰边框 */}
          <div className="absolute -inset-px bg-gradient-to-b from-amber-900/30 via-transparent to-amber-900/30 rounded-2xl" />
          <div className="absolute -inset-px bg-[#12121a]/90 rounded-2xl backdrop-blur-sm" />

          <form onSubmit={handleSubmit} className="relative p-8 md:p-10">
            <label className="block mb-6">
              <span className="text-amber-100/70 text-sm tracking-widest block mb-4">
                默念所问之事
              </span>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="闭上眼睛，在心中默念你的问题..."
                className="w-full h-32 bg-transparent text-amber-50/90 text-lg placeholder:text-amber-100/30 resize-none outline-none border-b border-amber-900/30 pb-4 focus:border-amber-700/50 transition-colors duration-300"
                autoFocus
              />
            </label>

            <div className="flex items-center justify-between mt-8">
              {/* 左侧装饰 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-900/40" />
                <div className="w-1 h-1 bg-amber-700/50 rounded-full" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-900/40" />
              </div>

              {/* 提交按钮 */}
              <motion.button
                type="submit"
                disabled={!question.trim()}
                whileHover={{ scale: question.trim() ? 1.02 : 1 }}
                whileTap={{ scale: question.trim() ? 0.98 : 1 }}
                className={`
                  px-8 py-3 rounded-lg font-medium tracking-wider transition-all duration-300
                  ${question.trim()
                    ? 'bg-gradient-to-r from-amber-900/40 to-amber-800/30 text-amber-100 border border-amber-700/40 hover:from-amber-900/50 hover:to-amber-800/40 hover:border-amber-600/50'
                    : 'bg-amber-900/20 text-amber-100/30 border border-amber-900/20 cursor-not-allowed'
                  }
                `}
              >
                开始占卜
              </motion.button>

              {/* 右侧装饰 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-900/40" />
                <div className="w-1 h-1 bg-amber-700/50 rounded-full" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-900/40" />
              </div>
            </div>
          </form>
        </motion.div>

        {/* 底部提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-amber-100/30 text-xs mt-8 tracking-wider"
        >
          静心 · 诚念 · 感应
        </motion.p>
      </motion.div>

      {/* 返回入口 */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute top-6 left-6 text-amber-100/40 hover:text-amber-100/70 text-sm tracking-wider transition-colors duration-300"
      >
        ← 虚空
      </motion.a>
    </div>
  );
}
