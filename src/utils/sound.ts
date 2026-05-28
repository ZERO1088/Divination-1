// ============================================================
// sound.ts —— 音效桥接层
// 兼容旧接口，内部委托给 enhancedSound.ts
// ============================================================

// 重新导出所有增强音效
export {
  playCoinRelease,
  playCoinImpact,
  playCoinBounce,
  playCoinFriction,
  playCoinSettle,
  playDivinationConfirm,
  playChangingYaoActivate,
  playSound,
  type SoundType,
  // 兼容旧接口
  playCoinRelease as coinToss,
  playCoinImpact as coinLand,
} from './enhancedSound';
