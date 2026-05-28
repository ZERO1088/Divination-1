// ============================================================
// 塔罗大阿卡纳专属 SVG 艺术牌面
// 风格：黑金暗调、极简克制线条、几何神秘符号
// ============================================================

import type { ReactNode } from 'react';

// SVG 颜色配置
export const CARD_COLORS = {
  gold: '#D4AF37',
  goldDim: 'rgba(212, 175, 55, 0.6)',
  goldFaint: 'rgba(212, 175, 55, 0.3)',
  background: '#1a1520',
  backgroundLight: '#252030',
} as const;

// 基础 SVG 组件属性
interface TarotSVGProps {
  size?: number;
  className?: string;
}

// ============================================================
// 0. 愚者 (The Fool)
// 象征：无限可能、纯净、悬崖边的舞蹈
// 设计：圆形代表无限，悬崖边缘，一个抽象人形站在边缘
// ============================================================
export function FoolSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 无限之环 */}
      <circle cx="50" cy="35" r="18" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      <circle cx="50" cy="35" r="12" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1" />
      
      {/* 悬崖边缘 */}
      <path d="M 15 75 L 45 75 L 50 85 L 85 85" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" strokeLinecap="round" />
      <path d="M 20 70 L 40 70" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      
      {/* 抽象人形 - 愚者站在悬崖边 */}
      <circle cx="50" cy="55" r="4" fill={CARD_COLORS.gold} />
      <path d="M 50 59 L 50 68" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 62 L 45 58" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 62 L 55 58" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 68 L 46 72" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 50 68 L 54 72" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      
      {/* 飘动的羽毛 */}
      <path d="M 62 48 Q 70 45 68 52 Q 72 48 75 55" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.75" />
      
      {/* 装饰性星辰 */}
      <circle cx="75" cy="25" r="1" fill={CARD_COLORS.goldDim} />
      <circle cx="25" cy="30" r="0.8" fill={CARD_COLORS.goldFaint} />
      <circle cx="80" cy="40" r="0.6" fill={CARD_COLORS.goldFaint} />
    </svg>
  );
}

// ============================================================
// 1. 魔术师 (The Magician)
// 象征：创造、显化、意志力
// 设计：四元素符号围绕无限符号，中央祭坛
// ============================================================
export function MagicianSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 无限符号 */}
      <path d="M 50 25 C 65 25 70 35 70 40 C 70 50 55 50 55 55 C 55 65 45 65 30 55 C 15 45 30 25 45 25 C 60 25 55 35 55 40 C 55 45 40 45 40 40 C 40 30 50 25 50 25" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      
      {/* 中央祭坛/桌子 */}
      <rect x="30" y="70" width="40" height="4" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" rx="1" />
      <path d="M 35 74 L 35 82" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 65 74 L 65 82" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 四元素符号 - 火水风土 */}
      {/* 火 - 向上三角形 */}
      <path d="M 50 45 L 45 52 L 55 52 Z" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      {/* 水 - 向下三角形 */}
      <path d="M 25 35 L 20 28 L 30 28 Z" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      {/* 风 - 三角形加横线 */}
      <path d="M 75 35 L 70 28 L 80 28 M 70 31.5 L 80 31.5" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      {/* 土 - 向下三角形加十字 */}
      <path d="M 25 65 L 20 72 L 30 72 Z M 25 68 L 25 72 M 22.5 70 L 27.5 70" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      
      {/* 神圣光线 */}
      <path d="M 50 15 L 50 22" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 45 16 L 47 22" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 55 16 L 53 22" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 2. 女祭司 (The High Priestess)
// 象征：直觉、神秘、潜意识
// 设计：新月怀抱神秘之眼，月亮与星星
// ============================================================
export function HighPriestessSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 新月弧 */}
      <path d="M 50 15 A 30 30 0 1 1 50 85 A 20 20 0 1 0 50 15" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      
      {/* 神秘之眼 */}
      <ellipse cx="50" cy="45" rx="12" ry="8" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      <circle cx="50" cy="45" r="4" fill={CARD_COLORS.gold} />
      <circle cx="50" cy="45" r="2" fill={CARD_COLORS.background} />
      
      {/* 月亮装饰 */}
      <circle cx="30" cy="25" r="3" fill={CARD_COLORS.goldFaint} />
      <circle cx="75" cy="70" r="2" fill={CARD_COLORS.goldFaint} />
      
      {/* 神秘符号 - 三层月亮 */}
      <path d="M 50 60 L 47 68 L 53 68 Z" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      <circle cx="50" cy="73" r="2" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      
      {/* 垂直的神秘卷轴 */}
      <rect x="78" y="25" width="4" height="50" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" rx="2" />
      <path d="M 80 30 L 80 70" stroke={CARD_COLORS.goldDim} strokeWidth="0.3" strokeDasharray="2,2" />
    </svg>
  );
}

// ============================================================
// 3. 女皇 (The Empress)
// 象征：丰饶、滋养、感官享受
// 设计：维纳斯符号，女性轮廓，麦穗环绕
// ============================================================
export function EmpressSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 维纳斯符号 - 圆圈 + 十字 + 下方三角形 */}
      <circle cx="50" cy="40" r="15" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <path d="M 50 25 L 50 55" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <path d="M 35 40 L 65 40" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <path d="M 50 55 L 42 70 L 58 70 Z" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      
      {/* 麦穗 - 左侧 */}
      <path d="M 20 80 Q 25 60 20 45" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <ellipse cx="18" cy="50" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      <ellipse cx="22" cy="58" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      <ellipse cx="20" cy="66" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      <ellipse cx="18" cy="74" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      
      {/* 麦穗 - 右侧 */}
      <path d="M 80 80 Q 75 60 80 45" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <ellipse cx="82" cy="50" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      <ellipse cx="78" cy="58" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      <ellipse cx="80" cy="66" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      <ellipse cx="82" cy="74" rx="2" ry="4" fill={CARD_COLORS.goldFaint} />
      
      {/* 星星装饰 */}
      <path d="M 15 25 L 15 35 M 10 30 L 20 30" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 85 25 L 85 35 M 80 30 L 90 30" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 4. 皇帝 (The Emperor)
// 象征：权威、秩序、理性
// 设计：方形宝座，四根柱子，抽象王冠
// ============================================================
export function EmperorSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 抽象王冠 */}
      <path d="M 35 30 L 40 20 L 50 28 L 60 20 L 65 30" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M 35 30 L 65 30" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <circle cx="50" cy="20" r="2" fill={CARD_COLORS.gold} />
      <circle cx="40" cy="16" r="1.5" fill={CARD_COLORS.goldDim} />
      <circle cx="60" cy="16" r="1.5" fill={CARD_COLORS.goldDim} />
      
      {/* 方形宝座 */}
      <rect x="30" y="38" width="40" height="35" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      
      {/* 四根柱子 */}
      <path d="M 35 73 L 35 90" stroke={CARD_COLORS.goldDim} strokeWidth="2" />
      <path d="M 45 73 L 45 90" stroke={CARD_COLORS.goldDim} strokeWidth="2" />
      <path d="M 55 73 L 55 90" stroke={CARD_COLORS.goldDim} strokeWidth="2" />
      <path d="M 65 73 L 65 90" stroke={CARD_COLORS.goldDim} strokeWidth="2" />
      
      {/* 基座 */}
      <rect x="28" y="88" width="44" height="5" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" rx="1" />
      
      {/* 神圣几何 - 嵌套方形 */}
      <rect x="38" y="46" width="24" height="24" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <rect x="42" y="50" width="16" height="16" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 5. 教皇 (The Hierophant)
// 象征：精神指引、传统、信仰
// 设计：三重祭坛，神圣钥匙，神圣几何
// ============================================================
export function HierophantSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 三重祭坛/台阶 */}
      <rect x="25" y="70" width="50" height="8" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" rx="1" />
      <rect x="30" y="60" width="40" height="8" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" rx="1" />
      <rect x="35" y="50" width="30" height="8" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" rx="1" />
      
      {/* 中央十字权杖 */}
      <path d="M 50 25 L 50 85" stroke={CARD_COLORS.gold} strokeWidth="2" />
      <path d="M 40 35 L 60 35" stroke={CARD_COLORS.gold} strokeWidth="2" />
      <circle cx="50" cy="22" r="4" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      
      {/* 神圣钥匙 - 左 */}
      <path d="M 25 40 L 35 40 L 35 50" stroke={CARD_COLORS.goldFaint} strokeWidth="1" />
      <circle cx="22" cy="40" r="5" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="1" />
      
      {/* 神圣钥匙 - 右 */}
      <path d="M 75 40 L 65 40 L 65 50" stroke={CARD_COLORS.goldFaint} strokeWidth="1" />
      <circle cx="78" cy="40" r="5" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="1" />
      
      {/* 神圣几何 - 三角形 */}
      <path d="M 50 20 L 45 28 L 55 28 Z" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 6. 恋人 (The Lovers)
// 象征：真爱、选择、和谐
// 设计：两个交缠的弧线，心形，天平
// ============================================================
export function LoversSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 两个交缠的灵魂弧线 */}
      <path d="M 30 50 Q 40 30 50 50 Q 60 70 70 50" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      <path d="M 30 55 Q 40 35 50 55 Q 60 75 70 55" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      
      {/* 中央心形 */}
      <path d="M 50 35 C 45 30 38 35 38 42 C 38 50 50 58 50 58 C 50 58 62 50 62 42 C 62 35 55 30 50 35" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      
      {/* 选择的天平 */}
      <path d="M 50 62 L 50 72" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 30 67 L 70 67" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 30 67 L 30 72" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 70 67 L 70 72" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 天使/爱的象征 */}
      <circle cx="50" cy="22" r="3" fill={CARD_COLORS.goldFaint} />
      <path d="M 50 25 L 50 32" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      <path d="M 46 28 L 54 28" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      
      {/* 星辰装饰 */}
      <circle cx="25" cy="35" r="1" fill={CARD_COLORS.goldFaint} />
      <circle cx="75" cy="35" r="1" fill={CARD_COLORS.goldFaint} />
    </svg>
  );
}

// ============================================================
// 7. 战车 (The Chariot)
// 象征：胜利、意志、克服障碍
// 设计：战车轮廓，新月，新月与星星
// ============================================================
export function ChariotSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 战车方形 */}
      <rect x="25" y="40" width="50" height="30" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" rx="3" />
      
      {/* 新月拱门 */}
      <path d="M 35 40 Q 35 30 50 30 Q 65 30 65 40" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      <circle cx="50" cy="35" r="8" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 战车轮子 */}
      <circle cx="32" cy="78" r="8" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      <circle cx="32" cy="78" r="3" fill={CARD_COLORS.goldFaint} />
      <circle cx="68" cy="78" r="8" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      <circle cx="68" cy="78" r="3" fill={CARD_COLORS.goldFaint} />
      
      {/* 胜利棕榈叶 */}
      <path d="M 78 50 Q 85 45 88 55 Q 85 50 90 58" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      <path d="M 22 50 Q 15 45 12 55 Q 15 50 10 58" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      
      {/* 星星装饰 */}
      <circle cx="20" cy="25" r="1.5" fill={CARD_COLORS.goldFaint} />
      <circle cx="80" cy="25" r="1.5" fill={CARD_COLORS.goldFaint} />
    </svg>
  );
}

// ============================================================
// 8. 力量 (Strength)
// 象征：勇气、耐心、内在力量
// 设计：无限符号，狮子轮廓，∞柔韧线条
// ============================================================
export function StrengthSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 无限符号 */}
      <path d="M 50 30 C 65 30 70 40 70 45 C 70 55 55 55 55 60 C 55 70 45 70 30 60 C 15 50 30 30 45 30 C 60 30 55 40 55 45 C 55 50 40 50 40 45 C 40 35 50 30 50 30" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="2" />
      
      {/* 狮子轮廓 - 简化几何 */}
      <ellipse cx="50" cy="72" rx="18" ry="12" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      {/* 鬃毛 */}
      <path d="M 35 65 Q 30 58 35 52" stroke={CARD_COLORS.goldDim} strokeWidth="1" fill="none" />
      <path d="M 38 63 Q 33 57 38 52" stroke={CARD_COLORS.goldDim} strokeWidth="1" fill="none" />
      <path d="M 65 65 Q 70 58 65 52" stroke={CARD_COLORS.goldDim} strokeWidth="1" fill="none" />
      <path d="M 62 63 Q 67 57 62 52" stroke={CARD_COLORS.goldDim} strokeWidth="1" fill="none" />
      {/* 狮头 */}
      <circle cx="50" cy="58" r="8" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      {/* 眼睛 */}
      <circle cx="47" cy="56" r="1.5" fill={CARD_COLORS.goldFaint} />
      <circle cx="53" cy="56" r="1.5" fill={CARD_COLORS.goldFaint} />
      {/* 嘴 */}
      <path d="M 48 61 L 50 63 L 52 61" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ============================================================
// 9. 隐者 (The Hermit)
// 象征：内省、智慧、孤独探索
// 设计：六芒星，提灯，孤独人影
// ============================================================
export function HermitSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 六芒星 */}
      {/* 向上三角形 */}
      <path d="M 50 20 L 35 45 L 65 45 Z" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      {/* 向下三角形 */}
      <path d="M 50 50 L 35 25 L 65 25 Z" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      
      {/* 孤独的人影 */}
      <circle cx="50" cy="60" r="5" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      <path d="M 50 65 L 50 80" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <path d="M 50 70 L 42 78" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      <path d="M 50 70 L 58 78" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      <path d="M 50 80 L 44 90" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      <path d="M 50 80 L 56 90" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      
      {/* 提灯 */}
      <path d="M 65 62 L 65 70" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <rect x="60" y="58" width="10" height="6" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" rx="2" />
      <circle cx="65" cy="61" r="2" fill={CARD_COLORS.goldFaint} />
      
      {/* 光芒射线 */}
      <path d="M 65 55 L 65 52" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 61 56 L 58 54" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 69 56 L 72 54" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      
      {/* 星星 */}
      <circle cx="30" cy="25" r="1" fill={CARD_COLORS.goldFaint} />
      <circle cx="75" cy="35" r="0.8" fill={CARD_COLORS.goldFaint} />
    </svg>
  );
}

// ============================================================
// 10. 命运之轮 (Wheel of Fortune)
// 象征：命运、转机、因果循环
// 设计：八芒星轮盘，塔罗符号环绕
// ============================================================
export function WheelOfFortuneSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 外圈 */}
      <circle cx="50" cy="50" r="35" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      
      {/* 八芒星 */}
      {/* 垂直线 */}
      <path d="M 50 15 L 50 85" stroke={CARD_COLORS.gold} strokeWidth="1" />
      {/* 水平线 */}
      <path d="M 15 50 L 85 50" stroke={CARD_COLORS.gold} strokeWidth="1" />
      {/* 对角线 */}
      <path d="M 25 25 L 75 75" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      <path d="M 75 25 L 25 75" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      
      {/* 内圈 */}
      <circle cx="50" cy="50" r="18" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      
      {/* 塔罗符号 - 简化的神圣符号 */}
      {/* 上 - 精神 */}
      <path d="M 50 32 L 47 38 L 53 38 Z" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      {/* 下 - 物质 */}
      <path d="M 50 68 L 47 62 L 53 62 Z" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      {/* 左 - 灵魂 */}
      <path d="M 32 50 L 38 47 L 38 53 Z" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      {/* 右 - 物质 */}
      <path d="M 68 50 L 62 47 L 62 53 Z" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      
      {/* 四个角落的符号 */}
      <circle cx="28" cy="28" r="3" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <circle cx="72" cy="28" r="3" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <circle cx="28" cy="72" r="3" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <circle cx="72" cy="72" r="3" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 11. 正义 (Justice)
// 象征：公平、真相、因果、裁决
// 设计：垂直的剑，天平，直角几何
// ============================================================
export function JusticeSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 垂直的剑 */}
      <path d="M 50 15 L 50 75" stroke={CARD_COLORS.gold} strokeWidth="2" />
      {/* 剑柄 */}
      <path d="M 45 75 L 55 75" stroke={CARD_COLORS.gold} strokeWidth="2" />
      <path d="M 50 75 L 50 80" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      {/* 剑尖 */}
      <path d="M 50 15 L 46 25 L 50 22 L 54 25 Z" fill={CARD_COLORS.gold} />
      
      {/* 天平 */}
      <path d="M 50 32 L 50 45" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 25 38 L 75 38" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      {/* 左盘 */}
      <path d="M 25 38 L 25 48" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 18 48 Q 25 55 32 48" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      {/* 右盘 */}
      <path d="M 75 38 L 75 48" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 68 48 Q 75 55 82 48" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 神圣几何 - 直角 */}
      <rect x="15" y="65" width="25" height="25" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <rect x="60" y="65" width="25" height="25" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 15 90 L 40 90 L 40 65" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 85 90 L 60 90 L 60 65" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 12. 倒吊人 (The Hanged Man)
// 象征：牺牲、放手、新视角
// 设计：倒置三角形，倒置人形，金色圆环
// ============================================================
export function HangedManSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 倒置三角形 */}
      <path d="M 50 75 L 25 30 L 75 30 Z" fill="none" stroke={CARD_COLORS.gold} strokeWidth="2" />
      
      {/* 倒置的人形 */}
      <circle cx="50" cy="45" r="4" fill={CARD_COLORS.goldDim} />
      {/* 身体 */}
      <path d="M 50 49 L 50 58" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      {/* 腿 - 向上分开 */}
      <path d="M 50 58 L 40 52" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      <path d="M 40 52 L 36 48" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      <path d="M 50 58 L 60 52" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      <path d="M 60 52 L 64 48" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      {/* 手臂 - 向下垂 */}
      <path d="M 50 52 L 42 58" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      <path d="M 50 52 L 58 58" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      
      {/* 金色圆环 - 代表牺牲的光环 */}
      <ellipse cx="50" cy="45" rx="10" ry="10" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <ellipse cx="50" cy="45" rx="14" ry="14" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.3" />
      
      {/* 悬挂的绳子/支点 */}
      <path d="M 50 20 L 50 30" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <circle cx="50" cy="18" r="3" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
    </svg>
  );
}

// ============================================================
// 13. 死神 (Death)
// 象征：终结、转变、重生
// 设计：五芒星，抽象面具，转化之门
// ============================================================
export function DeathSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 五芒星 */}
      <path d="M 50 20 L 38 75 L 75 40 L 25 40 L 62 75 Z" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinejoin="round" />
      
      {/* 中央眼睛 - 转化之门 */}
      <ellipse cx="50" cy="50" rx="8" ry="10" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <circle cx="50" cy="50" r="4" fill={CARD_COLORS.goldFaint} />
      <circle cx="50" cy="50" r="2" fill={CARD_COLORS.background} />
      
      {/* 几何装饰 */}
      <circle cx="50" cy="20" r="2" fill={CARD_COLORS.goldDim} />
      <circle cx="38" cy="75" r="2" fill={CARD_COLORS.goldDim} />
      <circle cx="62" cy="75" r="2" fill={CARD_COLORS.goldDim} />
      
      {/* 转化符号 - 上下箭头 */}
      <path d="M 50 80 L 50 88 M 47 85 L 50 88 L 53 85" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" fill="none" />
      <path d="M 50 90 L 50 82 M 47 85 L 50 82 L 53 85" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" fill="none" />
      
      {/* 装饰性方块 */}
      <rect x="20" y="25" width="8" height="8" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <rect x="72" y="25" width="8" height="8" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 14. 节制 (Temperance)
// 象征：平衡、调和、耐心
// 设计：两个圆之间的流动，蝴蝶
// ============================================================
export function TemperanceSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 两个容器圆 */}
      <circle cx="30" cy="45" r="15" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      <circle cx="70" cy="45" r="15" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      
      {/* 流动的曲线连接 */}
      <path d="M 45 45 Q 50 35 55 45 Q 50 55 55 65 Q 50 75 55 85" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" strokeDasharray="4,3" />
      <path d="M 30 45 C 30 30 50 30 50 45 C 50 60 70 60 70 45" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1" />
      
      {/* 蝴蝶 - 平衡的象征 */}
      <path d="M 50 55 Q 40 45 45 35 Q 50 40 55 35 Q 60 45 50 55" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1" />
      <path d="M 50 55 Q 40 65 45 75 Q 50 70 55 75 Q 60 65 50 55" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1" />
      <path d="M 50 55 L 50 85" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      
      {/* 水滴 */}
      <circle cx="30" cy="45" r="4" fill={CARD_COLORS.goldFaint} />
      <circle cx="70" cy="45" r="4" fill={CARD_COLORS.goldFaint} />
      
      {/* 翅膀装饰点 */}
      <circle cx="45" cy="42" r="1.5" fill={CARD_COLORS.goldFaint} />
      <circle cx="55" cy="42" r="1.5" fill={CARD_COLORS.goldFaint} />
      <circle cx="45" cy="68" r="1.5" fill={CARD_COLORS.goldFaint} />
      <circle cx="55" cy="68" r="1.5" fill={CARD_COLORS.goldFaint} />
    </svg>
  );
}

// ============================================================
// 15. 恶魔 (The Devil)
// 象征：束缚、欲望、阴影
// 设计：倒置五芒星，锁链，阴阳印记
// ============================================================
export function DevilSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 倒置五芒星 */}
      <path d="M 50 80 L 25 35 L 70 50 L 30 50 L 75 35 Z" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinejoin="round" />
      
      {/* 中央圆环 */}
      <circle cx="50" cy="55" r="12" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      <circle cx="50" cy="55" r="6" fill={CARD_COLORS.goldFaint} />
      
      {/* 锁链 - 缠绕 */}
      <path d="M 20 70 Q 15 60 25 55 Q 35 50 30 40" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" strokeDasharray="3,2" />
      <path d="M 80 70 Q 85 60 75 55 Q 65 50 70 40" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" strokeDasharray="3,2" />
      
      {/* 顶点装饰 */}
      <circle cx="25" cy="35" r="2" fill={CARD_COLORS.goldDim} />
      <circle cx="75" cy="35" r="2" fill={CARD_COLORS.goldDim} />
      <circle cx="30" cy="50" r="2" fill={CARD_COLORS.goldDim} />
      <circle cx="70" cy="50" r="2" fill={CARD_COLORS.goldDim} />
      
      {/* 上方三角 */}
      <path d="M 50 15 L 45 25 L 55 25 Z" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
    </svg>
  );
}

// ============================================================
// 16. 高塔 (The Tower)
// 象征：崩塌、突变、启示
// 设计：闪电击中高塔，碎片散落
// ============================================================
export function TowerSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 高塔 */}
      <path d="M 35 85 L 40 25 L 50 20 L 60 25 L 65 85" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      
      {/* 塔门 */}
      <path d="M 45 85 L 45 70 Q 50 65 55 70 L 55 85" 
        fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="1" />
      
      {/* 塔窗 */}
      <rect x="44" y="35" width="12" height="8" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" rx="1" />
      <rect x="44" y="50" width="12" height="8" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" rx="1" />
      
      {/* 闪电 */}
      <path d="M 50 10 L 45 25 L 52 25 L 48 40" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="2" strokeLinejoin="round" />
      
      {/* 碎片 - 崩塌 */}
      <path d="M 30 30 L 28 35 L 33 33 Z" fill={CARD_COLORS.goldFaint} />
      <path d="M 70 28 L 68 33 L 73 32 Z" fill={CARD_COLORS.goldFaint} />
      <circle cx="25" cy="45" r="2" fill={CARD_COLORS.goldFaint} />
      <circle cx="75" cy="48" r="1.5" fill={CARD_COLORS.goldFaint} />
      <path d="M 20 55 L 18 60 L 23 58 Z" fill={CARD_COLORS.goldFaint} />
      <path d="M 78 52 L 76 58 L 82 56 Z" fill={CARD_COLORS.goldFaint} />
      
      {/* 火焰/光芒 */}
      <path d="M 40 18 Q 42 22 40 26 Q 38 22 40 18" fill={CARD_COLORS.goldFaint} />
      <path d="M 60 18 Q 62 22 60 26 Q 58 22 60 18" fill={CARD_COLORS.goldFaint} />
    </svg>
  );
}

// ============================================================
// 17. 星星 (The Star)
// 象征：希望、疗愈、灵感
// 设计：七角星，水流，羽翼
// ============================================================
export function StarSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 七角星 - 神圣几何 */}
      <path d="M 50 15 L 56 35 L 78 35 L 60 48 L 68 70 L 50 55 L 32 70 L 40 48 L 22 35 L 44 35 Z" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" strokeLinejoin="round" />
      
      {/* 中央圆 */}
      <circle cx="50" cy="45" r="10" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <circle cx="50" cy="45" r="4" fill={CARD_COLORS.goldFaint} />
      
      {/* 水流 - 两条优雅的曲线 */}
      <path d="M 30 70 Q 35 80 30 90" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 70 70 Q 65 80 70 90" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 水滴 */}
      <circle cx="30" cy="85" r="2" fill={CARD_COLORS.goldFaint} />
      <circle cx="70" cy="85" r="2" fill={CARD_COLORS.goldFaint} />
      
      {/* 羽翼 - 希望 */}
      <path d="M 35 50 Q 25 45 20 55 Q 25 50 30 58" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      <path d="M 65 50 Q 75 45 80 55 Q 75 50 70 58" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      
      {/* 星辰装饰 */}
      <circle cx="25" cy="25" r="1" fill={CARD_COLORS.goldFaint} />
      <circle cx="75" cy="25" r="1" fill={CARD_COLORS.goldFaint} />
      <circle cx="50" cy="12" r="1.5" fill={CARD_COLORS.goldFaint} />
    </svg>
  );
}

// ============================================================
// 18. 月亮 (The Moon)
// 象征：幻象、恐惧、潜意识
// 设计：新月，水面倒影，星辰
// ============================================================
export function MoonSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 新月 */}
      <path d="M 50 15 A 30 30 0 1 1 50 85 A 22 22 0 1 0 50 15" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      
      {/* 月亮之眼 - 潜意识 */}
      <ellipse cx="42" cy="50" rx="8" ry="6" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <circle cx="42" cy="50" r="3" fill={CARD_COLORS.goldFaint} />
      <circle cx="42" cy="50" r="1.5" fill={CARD_COLORS.background} />
      
      {/* 水面倒影 */}
      <path d="M 20 80 Q 30 75 40 80 Q 50 85 60 80 Q 70 75 80 80" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 25 85 Q 35 82 45 85 Q 55 88 65 85 Q 75 82 85 85" 
        fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      
      {/* 星辰 - 恐惧中的希望 */}
      <circle cx="25" cy="30" r="1.5" fill={CARD_COLORS.goldFaint} />
      <circle cx="70" cy="25" r="1" fill={CARD_COLORS.goldFaint} />
      <circle cx="80" cy="35" r="0.8" fill={CARD_COLORS.goldFaint} />
      <circle cx="20" cy="45" r="0.8" fill={CARD_COLORS.goldFaint} />
      
      {/* 水中的月亮倒影 */}
      <circle cx="60" cy="82" r="3" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// 19. 太阳 (The Sun)
// 象征：成功、喜悦、活力
// 设计：太阳光芒，圆环，温暖符号
// ============================================================
export function SunSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 太阳 - 双重圆环 */}
      <circle cx="50" cy="45" r="22" fill="none" stroke={CARD_COLORS.gold} strokeWidth="2" />
      <circle cx="50" cy="45" r="15" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 太阳核心 */}
      <circle cx="50" cy="45" r="8" fill={CARD_COLORS.goldFaint} />
      <circle cx="50" cy="45" r="4" fill={CARD_COLORS.goldDim} />
      
      {/* 光芒射线 */}
      <path d="M 50 15 L 50 20" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <path d="M 50 70 L 50 78" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <path d="M 20 45 L 25 45" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      <path d="M 75 45 L 80 45" stroke={CARD_COLORS.gold} strokeWidth="1.5" />
      
      {/* 对角光芒 */}
      <path d="M 28 23 L 32 27" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 72 23 L 68 27" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 28 67 L 32 63" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 72 67 L 68 63" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 温暖的光晕 */}
      <circle cx="50" cy="45" r="30" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.3" />
      
      {/* 羽翼 - 胜利 */}
      <path d="M 25 50 Q 15 45 12 55 Q 18 48 25 55" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      <path d="M 75 50 Q 85 45 88 55 Q 82 48 75 55" 
        fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
    </svg>
  );
}

// ============================================================
// 20. 审判 (Judgement)
// 象征：觉醒、召唤、清算
// 设计：交叉手势，钟形，椭圆
// ============================================================
export function JudgementSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 大椭圆 - 召唤之门 */}
      <ellipse cx="50" cy="50" rx="30" ry="38" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1.5" />
      
      {/* 交叉手势 - 审判 */}
      <path d="M 50 20 L 50 80" stroke={CARD_COLORS.gold} strokeWidth="2" />
      <path d="M 30 42 L 70 42" stroke={CARD_COLORS.gold} strokeWidth="2" />
      
      {/* 中央人形 - 被召唤的灵魂 */}
      <circle cx="50" cy="35" r="4" fill={CARD_COLORS.goldDim} />
      <path d="M 50 39 L 50 50" stroke={CARD_COLORS.goldDim} strokeWidth="1.2" />
      <path d="M 50 43 L 44 50" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 50 43 L 56 50" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 50 50 L 46 58" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <path d="M 50 50 L 54 58" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      
      {/* 钟声符号 */}
      <path d="M 35 15 Q 35 12 38 12 L 62 12 Q 65 12 65 15 L 65 18 L 60 22 L 40 22 L 35 18 Z" 
        fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      <path d="M 50 12 L 50 8" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      <circle cx="50" cy="6" r="2" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <circle cx="50" cy="28" r="2" fill={CARD_COLORS.goldFaint} />
      
      {/* 两侧光柱 */}
      <path d="M 25 30 L 25 70" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
      <path d="M 75 30 L 75 70" stroke={CARD_COLORS.goldFaint} strokeWidth="0.8" />
    </svg>
  );
}

// ============================================================
// 21. 世界 (The World)
// 象征：完成、圆满、成就
// 设计：椭圆环，四元素，完整圆
// ============================================================
export function WorldSVG({ size = 100, className = '' }: TarotSVGProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 椭圆 - 世界之环 */}
      <ellipse cx="50" cy="50" rx="38" ry="32" fill="none" stroke={CARD_COLORS.gold} strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="32" ry="26" fill="none" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      <ellipse cx="50" cy="50" rx="25" ry="20" fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      
      {/* 四元素符号 */}
      {/* 火 - 上 */}
      <path d="M 50 22 L 46 30 L 54 30 Z" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      {/* 土 - 下 */}
      <path d="M 50 78 L 46 70 L 54 70 Z M 50 74 L 50 78 M 47 76 L 53 76" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      {/* 水 - 左 */}
      <path d="M 18 50 L 26 46 L 26 54 Z" fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      {/* 风 - 右 */}
      <path d="M 82 50 L 74 46 L 74 54 Z M 74 48 L 82 48" 
        fill="none" stroke={CARD_COLORS.gold} strokeWidth="1.2" />
      
      {/* 中央舞蹈者 */}
      <circle cx="50" cy="50" r="3" fill={CARD_COLORS.goldDim} />
      {/* 身体 */}
      <path d="M 50 53 L 50 62" stroke={CARD_COLORS.goldDim} strokeWidth="1" />
      {/* 飘动的姿态 */}
      <path d="M 50 56 L 42 52" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      <path d="M 50 56 L 58 52" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      <path d="M 50 62 L 44 68" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      <path d="M 50 62 L 56 68" stroke={CARD_COLORS.goldDim} strokeWidth="0.8" />
      
      {/* 缎带 - 圆满 */}
      <path d="M 30 50 Q 35 45 40 50 Q 35 55 30 50" 
        fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
      <path d="M 60 50 Q 65 45 70 50 Q 65 55 60 50" 
        fill="none" stroke={CARD_COLORS.goldFaint} strokeWidth="0.5" />
    </svg>
  );
}

// ============================================================
// SVG 组件映射表
// ============================================================
export const TAROT_MAJOR_ARCANA_SVGS: Record<number, (props: TarotSVGProps) => ReactNode> = {
  0: FoolSVG,
  1: MagicianSVG,
  2: HighPriestessSVG,
  3: EmpressSVG,
  4: EmperorSVG,
  5: HierophantSVG,
  6: LoversSVG,
  7: ChariotSVG,
  8: StrengthSVG,
  9: HermitSVG,
  10: WheelOfFortuneSVG,
  11: JusticeSVG,
  12: HangedManSVG,
  13: DeathSVG,
  14: TemperanceSVG,
  15: DevilSVG,
  16: TowerSVG,
  17: StarSVG,
  18: MoonSVG,
  19: SunSVG,
  20: JudgementSVG,
  21: WorldSVG,
};
