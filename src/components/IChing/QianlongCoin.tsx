import { motion } from 'framer-motion';

// 乾隆通宝铜钱 - 正面（满文样式）
const CoinFront = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    {/* 外圈 */}
    <circle cx="40" cy="40" r="38" stroke="#C9A961" strokeWidth="2" fill="#1a1510" />
    <circle cx="40" cy="40" r="35" stroke="#8B7355" strokeWidth="1" fill="none" />
    
    {/* 边缘装饰点 */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <circle
        key={i}
        cx={40 + 36 * Math.cos((angle * Math.PI) / 180)}
        cy={40 + 36 * Math.sin((angle * Math.PI) / 180)}
        r="1"
        fill="#C9A961"
      />
    ))}
    
    {/* 满文样式 - 中央方孔 */}
    <rect x="30" y="30" width="20" height="20" rx="2" stroke="#C9A961" strokeWidth="2" fill="#0d0a08" />
    
    {/* 满文装饰线条 */}
    <line x1="32" y1="40" x2="38" y2="40" stroke="#8B7355" strokeWidth="1" />
    <line x1="42" y1="40" x2="48" y2="40" stroke="#8B7355" strokeWidth="1" />
    <line x1="40" y1="32" x2="40" y2="38" stroke="#8B7355" strokeWidth="1" />
    <line x1="40" y1="42" x2="40" y2="48" stroke="#8B7355" strokeWidth="1" />
    
    {/* 上方满文风格装饰 */}
    <path d="M28 20 L30 24 L32 20 L34 24 L36 20 L38 24 L40 20 L42 24 L44 20 L46 24 L48 20 L50 24 L52 20" stroke="#8B7355" strokeWidth="1" fill="none" />
    
    {/* 下方满文风格装饰 */}
    <path d="M28 60 L30 56 L32 60 L34 56 L36 60 L38 56 L40 60 L42 56 L44 60 L46 56 L48 60 L50 56 L52 60" stroke="#8B7355" strokeWidth="1" fill="none" />
  </svg>
);

// 传统背面 - 太极阴阳纹
const CoinBack = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    {/* 外圈 */}
    <circle cx="40" cy="40" r="38" stroke="#C9A961" strokeWidth="2" fill="#1a1510" />
    <circle cx="40" cy="40" r="35" stroke="#8B7355" strokeWidth="1" fill="none" />
    
    {/* 边缘装饰 - 回纹 */}
    <circle cx="40" cy="40" r="36" stroke="#6B5B4F" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
    
    {/* 中央太极图 */}
    <g transform="translate(40, 40)">
      {/* 阳鱼 */}
      <circle cx="0" cy="-8" r="8" fill="#1a1510" stroke="#C9A961" strokeWidth="1" />
      {/* 阴鱼 */}
      <circle cx="0" cy="8" r="8" fill="#1a1510" stroke="#C9A961" strokeWidth="1" />
      {/* 阴阳眼 */}
      <circle cx="0" cy="-8" r="2" fill="#C9A961" />
      <circle cx="0" cy="8" r="2" fill="#1a1510" />
      <circle cx="0" cy="8" r="1" fill="#C9A961" />
    </g>
    
    {/* 四角装饰 - 八卦符号 */}
    <text x="22" y="22" fill="#6B5B4F" fontSize="6" fontFamily="serif">☰</text>
    <text x="54" y="22" fill="#6B5B4F" fontSize="6" fontFamily="serif">☱</text>
    <text x="22" y="64" fill="#6B5B4F" fontSize="6" fontFamily="serif">☲</text>
    <text x="54" y="64" fill="#6B5B4F" fontSize="6" fontFamily="serif">☳</text>
  </svg>
);

interface QianlongCoinProps {
  shaking?: boolean;
  showFront?: boolean;
  isYang?: boolean;
}

// 乾隆通宝铜钱组件 - 正面满文 + 背面太极
export const QianlongCoin = ({ shaking, showFront, isYang }: QianlongCoinProps) => {
  // isYang 为 true 表示正面（阳），为 false 表示背面（阴）
  const showCoinBack = showFront !== undefined && !isYang;

  return (
    <motion.div
      className="relative"
      animate={shaking ? {
        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
        scale: [1, 1.05, 0.95, 1],
      } : {}}
      transition={shaking ? { duration: 0.5, ease: 'easeInOut' } : {}}
    >
      {/* 铜钱主体 */}
      <div className="relative">
        {/* 阴影效果 */}
        <div className="absolute inset-0 bg-black/30 blur-sm rounded-full transform translate-y-1" />
        
        {/* 铜钱 SVG */}
        <motion.div
          initial={false}
          animate={{
            rotateY: showFront !== undefined ? (showCoinBack ? 180 : 0) : 0,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          className="relative"
        >
          {/* 正面（阳 - 满文） */}
          <div
            className="backface-hidden"
            style={{
              transform: showFront !== undefined && !isYang ? 'rotateY(180deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <CoinFront />
          </div>
          
          {/* 背面（阴 - 太极） */}
          <div
            className="backface-hidden absolute inset-0"
            style={{
              transform: showFront !== undefined && !isYang ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <CoinBack />
          </div>
        </motion.div>
        
        {/* 金属光泽效果 */}
        <div 
          className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,97,0.4) 0%, transparent 50%, rgba(201,169,97,0.2) 100%)',
          }}
        />
      </div>
      
      {/* 状态指示（调试用，可移除） */}
      {showFront !== undefined && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-amber-800/50">
          {isYang ? '阳' : '阴'}
        </div>
      )}
    </motion.div>
  );
};

// 简化版铜钱组件（用于小尺寸展示）
export const MiniCoin = ({ isYang }: { isYang: boolean }) => (
  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-700/50 flex items-center justify-center">
    <div className={`w-1.5 h-1.5 rounded-full ${isYang ? 'bg-amber-600' : 'bg-transparent border border-amber-600/50'}`} />
  </div>
);

export default QianlongCoin;
