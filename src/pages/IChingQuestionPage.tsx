import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function IChingQuestionPage() {
  const [question, setQuestionLocal] = useState('');
  const navigate = useNavigate();
  const { setQuestion } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      setQuestion(question.trim());
      navigate('/iching');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 八卦暗纹背景 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60M15 15l30 30M45 15l-30 30' stroke='%23D4AF37' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
      }} />

      {/* 装饰线条 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-serif text-[#D4AF37] tracking-widest mb-4">易经占卜</h1>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#8B7355] to-transparent mx-auto" />
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-lg relative"
      >
        <div className="bg-[#12121a]/80 backdrop-blur-sm border border-[#8B7355]/30 rounded-lg p-8">
          <label className="block text-[#D4AF37]/80 text-sm tracking-wider mb-4 text-center">
            静心凝神，心中默念所问之事
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestionLocal(e.target.value)}
            placeholder="请输入您想占卜的问题..."
            className="w-full h-32 bg-[#0a0a0f]/60 border border-[#8B7355]/40 rounded-lg px-4 py-3 text-[#e8e4d9] placeholder-[#8B7355]/50 resize-none focus:outline-none focus:border-[#D4AF37]/60 transition-colors font-serif text-base leading-relaxed"
            autoFocus
          />

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={!question.trim()}
              className="px-8 py-3 bg-gradient-to-b from-[#8B7355]/20 to-[#6B5344]/30 border border-[#D4AF37]/50 text-[#D4AF37] rounded-lg tracking-widest text-sm hover:from-[#8B7355]/30 hover:to-[#6B5344]/40 hover:border-[#D4AF37]/70 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              开始占卜
            </button>
          </div>
        </div>
      </motion.form>

      {/* 底部装饰 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-8"
      >
        <button
          onClick={() => navigate('/')}
          className="text-[#8B7355]/60 text-sm hover:text-[#D4AF37]/80 transition-colors"
        >
          ← 返回虚空
        </button>
      </motion.div>
    </div>
  );
}
