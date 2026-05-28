// ============================================================
// enhancedSound.ts —— 分层音效合成系统
// 金属碰撞 · 木质共鸣 · 空间回响 · 仪式氛围
// ============================================================

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** 音效类型枚举 */
export type SoundType = 
  | 'coinRelease'      // 铜钱离手瞬间
  | 'coinImpact'       // 铜钱撞击桌面
  | 'coinBounce'       // 弹跳声
  | 'coinFriction'     // 摩擦滑行
  | 'coinFinalSettle'; // 最终静止

interface SoundConfig {
  /** 基础音量 */
  volume: number;
  /** 是否添加空间混响 */
  reverb: boolean;
  /** 音调变化范围 */
  pitchVariation: number;
}

/** 默认音效配置 */
const DEFAULT_SOUND_CONFIG: SoundConfig = {
  volume: 0.08,
  reverb: true,
  pitchVariation: 0.1,
};

/** ============================================================
 * 核心合成器：金属撞击声
 * 包含：瞬态冲击 + 金属泛音 + 木质共鸣 + 空间回响
 * ============================================================ */
function synthesizeMetalImpact(
  audioCtx: AudioContext,
  startTime: number,
  intensity: number = 1,
  config: Partial<SoundConfig> = {}
): void {
  const cfg = { ...DEFAULT_SOUND_CONFIG, ...config };
  const volume = cfg.volume * intensity;
  
  // ---- 1. 瞬态冲击层（0-20ms）----
  // 金属撞击的初始瞬态
  const transientOsc = audioCtx.createOscillator();
  const transientGain = audioCtx.createGain();
  transientOsc.type = 'square';
  transientOsc.frequency.setValueAtTime(2800 + Math.random() * 400, startTime);
  transientOsc.frequency.exponentialRampToValueAtTime(1200, startTime + 0.015);
  transientGain.gain.setValueAtTime(volume * 0.4, startTime);
  transientGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02);
  transientOsc.connect(transientGain).connect(audioCtx.destination);
  transientOsc.start(startTime);
  transientOsc.stop(startTime + 0.02);

  // ---- 2. 金属泛音层（20-200ms）----
  // 金属的清脆高频泛音
  const metalFreqs = [4200, 5600, 7800, 11000];
  metalFreqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const detune = (Math.random() - 0.5) * cfg.pitchVariation * 100;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq + detune, startTime + 0.005);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6 + detune, startTime + 0.15);
    
    gain.gain.setValueAtTime(volume * 0.15 * (1 - i * 0.2), startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2 - i * 0.03);
    
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(startTime + 0.005);
    osc.stop(startTime + 0.2);
  });

  // ---- 3. 木质共鸣层（50-300ms）----
  // 桌面的中低频木质共鸣
  const woodOsc = audioCtx.createOscillator();
  const woodGain = audioCtx.createGain();
  const woodFilter = audioCtx.createBiquadFilter();
  
  woodFilter.type = 'lowpass';
  woodFilter.frequency.setValueAtTime(800, startTime + 0.03);
  woodFilter.frequency.exponentialRampToValueAtTime(200, startTime + 0.25);
  woodFilter.Q.setValueAtTime(2, startTime);
  
  woodOsc.type = 'triangle';
  woodOsc.frequency.setValueAtTime(180 + Math.random() * 60, startTime + 0.03);
  woodOsc.frequency.exponentialRampToValueAtTime(80, startTime + 0.2);
  
  woodGain.gain.setValueAtTime(volume * 0.35, startTime + 0.03);
  woodGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
  
  woodOsc.connect(woodFilter).connect(woodGain).connect(audioCtx.destination);
  woodOsc.start(startTime + 0.03);
  woodOsc.stop(startTime + 0.3);

  // ---- 4. 空间回响层（可选，100-500ms）----
  if (cfg.reverb) {
    const reverbOsc = audioCtx.createOscillator();
    const reverbGain = audioCtx.createGain();
    const reverbFilter = audioCtx.createBiquadFilter();
    
    reverbFilter.type = 'lowpass';
    reverbFilter.frequency.setValueAtTime(2000, startTime + 0.05);
    reverbFilter.frequency.exponentialRampToValueAtTime(400, startTime + 0.4);
    
    reverbOsc.type = 'sine';
    reverbOsc.frequency.setValueAtTime(340, startTime + 0.05);
    
    reverbGain.gain.setValueAtTime(volume * 0.12, startTime + 0.05);
    reverbGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
    
    reverbOsc.connect(reverbFilter).connect(reverbGain).connect(audioCtx.destination);
    reverbOsc.start(startTime + 0.05);
    reverbOsc.stop(startTime + 0.5);
  }
}

/** ============================================================
 * 抛出瞬间音效
 * 金属脱离接触的清脆声
 * ============================================================ */
export function playCoinRelease(): void {
  try {
    const c = ctx();
    const t = c.currentTime;
    
    // 金属瞬态
    const transient = c.createOscillator();
    const transientGain = c.createGain();
    transient.type = 'triangle';
    transient.frequency.setValueAtTime(3200, t);
    transient.frequency.exponentialRampToValueAtTime(1800, t + 0.06);
    transientGain.gain.setValueAtTime(0.06, t);
    transientGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    transient.connect(transientGain).connect(c.destination);
    transient.start(t);
    transient.stop(t + 0.08);

    // 轻微的气流声
    const air = c.createOscillator();
    const airGain = c.createGain();
    const airFilter = c.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.setValueAtTime(800, t);
    airFilter.Q.setValueAtTime(0.5, t);
    air.type = 'sawtooth';
    air.frequency.setValueAtTime(200, t + 0.02);
    airGain.gain.setValueAtTime(0.008, t + 0.02);
    airGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    air.connect(airFilter).connect(airGain).connect(c.destination);
    air.start(t + 0.02);
    air.stop(t + 0.12);
  } catch {
    // 静默失败
  }
}

/** ============================================================
 * 铜钱首次撞击音效（最强）
 * ============================================================ */
export function playCoinImpact(intensity: number = 1): void {
  try {
    const c = ctx();
    synthesizeMetalImpact(c, c.currentTime, intensity, {
      volume: 0.1,
      reverb: true,
    });
  } catch {
    // 静默失败
  }
}

/** ============================================================
 * 铜钱弹跳音效（较弱）
 * ============================================================ */
export function playCoinBounce(bounceIndex: number = 1): void {
  try {
    const c = ctx();
    const intensity = Math.max(0.3, 1 - bounceIndex * 0.25);
    synthesizeMetalImpact(c, c.currentTime, intensity, {
      volume: 0.07,
      reverb: true,
      pitchVariation: 0.15,
    });
  } catch {
    // 静默失败
  }
}

/** ============================================================
 * 摩擦滑行音效
 * ============================================================ */
export function playCoinFriction(): void {
  try {
    const c = ctx();
    const t = c.currentTime;
    
    // 低频摩擦声
    const noise = c.createOscillator();
    const noiseGain = c.createGain();
    const noiseFilter = c.createBiquadFilter();
    
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(300, t);
    noiseFilter.Q.setValueAtTime(1, t);
    
    noise.type = 'sawtooth';
    noise.frequency.setValueAtTime(80 + Math.random() * 40, t);
    
    noiseGain.gain.setValueAtTime(0.025, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    
    noise.connect(noiseFilter).connect(noiseGain).connect(c.destination);
    noise.start(t);
    noise.stop(t + 0.15);
  } catch {
    // 静默失败
  }
}

/** ============================================================
 * 最终静止音效（极弱）
 * ============================================================ */
export function playCoinSettle(): void {
  try {
    const c = ctx();
    synthesizeMetalImpact(c, c.currentTime, 0.2, {
      volume: 0.04,
      reverb: false,
      pitchVariation: 0.2,
    });
  } catch {
    // 静默失败
  }
}

/** ============================================================
 * 卦象形成确认音效
 * 远古钟声的极轻余韵
 * ============================================================ */
export function playDivinationConfirm(): void {
  try {
    const c = ctx();
    const t = c.currentTime;
    
    // 主音
    const mainOsc = c.createOscillator();
    const mainGain = c.createGain();
    mainOsc.type = 'sine';
    mainOsc.frequency.setValueAtTime(528, t); // 528Hz - 仪式频率
    mainOsc.frequency.exponentialRampToValueAtTime(520, t + 0.8);
    mainGain.gain.setValueAtTime(0.025, t);
    mainGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    mainOsc.connect(mainGain).connect(c.destination);
    mainOsc.start(t);
    mainOsc.stop(t + 0.8);

    // 泛音
    const harmonic = c.createOscillator();
    const harmonicGain = c.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(1056, t + 0.05);
    harmonicGain.gain.setValueAtTime(0.012, t + 0.05);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    harmonic.connect(harmonicGain).connect(c.destination);
    harmonic.start(t + 0.05);
    harmonic.stop(t + 0.6);
  } catch {
    // 静默失败
  }
}

/** ============================================================
 * 动爻激活音效
 * 金色能量流动的微弱提示
 * ============================================================ */
export function playChangingYaoActivate(): void {
  try {
    const c = ctx();
    const t = c.currentTime;
    
    // 极轻的能量流动声
    const flow = c.createOscillator();
    const flowGain = c.createGain();
    const flowFilter = c.createBiquadFilter();
    
    flowFilter.type = 'bandpass';
    flowFilter.frequency.setValueAtTime(1200, t);
    flowFilter.Q.setValueAtTime(0.3, t);
    
    flow.type = 'sine';
    flow.frequency.setValueAtTime(880, t);
    flow.frequency.linearRampToValueAtTime(920, t + 0.3);
    
    flowGain.gain.setValueAtTime(0, t);
    flowGain.gain.linearRampToValueAtTime(0.015, t + 0.15);
    flowGain.gain.linearRampToValueAtTime(0.008, t + 0.4);
    flowGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    
    flow.connect(flowFilter).connect(flowGain).connect(c.destination);
    flow.start(t);
    flow.stop(t + 0.6);
  } catch {
    // 静默失败
  }
}

/** ============================================================
 * 统一播放接口
 * ============================================================ */
export function playSound(type: SoundType, param?: number): void {
  switch (type) {
    case 'coinRelease':
      playCoinRelease();
      break;
    case 'coinImpact':
      playCoinImpact(param ?? 1);
      break;
    case 'coinBounce':
      playCoinBounce(param ?? 1);
      break;
    case 'coinFriction':
      playCoinFriction();
      break;
    case 'coinFinalSettle':
      playCoinSettle();
      break;
  }
}
