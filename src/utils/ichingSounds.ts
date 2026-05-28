// ============================================================
// ichingSounds.ts —— 六爻摇卦音效
// 真实金属铜钱音效
// ============================================================

let audioContext: AudioContext | null = null;

// 获取或创建 AudioContext
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// 生成金属碰撞音效（带木质共鸣）
function createCoinImpactSound(ctx: AudioContext, intensity: number = 1): void {
  const duration = 0.3 * intensity;
  const sampleRate = ctx.sampleRate;
  const bufferSize = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    // 金属瞬态（高频）
    const metal = Math.exp(-t * 60) * 0.6 * (Math.random() * 0.5 + 0.5);
    // 金属泛音
    const harmonics = Math.exp(-t * 30) * 0.4 * (
      Math.sin(t * 3000 * Math.PI) * 0.5 +
      Math.sin(t * 4500 * Math.PI) * 0.3 +
      Math.sin(t * 6000 * Math.PI) * 0.2
    );
    // 木质共鸣（中频）
    const wood = Math.exp(-t * 25) * 0.2 * Math.sin(t * 400 * Math.PI);
    data[i] = (metal + harmonics + wood) * intensity;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // 创建增益节点控制音量
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.7;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start();
}

// 生成摇晃音效
function createShakeSound(ctx: AudioContext): void {
  const duration = 0.3;
  const sampleRate = ctx.sampleRate;
  const bufferSize = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  // 模拟铜钱在碗中碰撞的声音
  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    // 随机碰撞声
    const shake = Math.random() > 0.7 ? Math.exp(-(t % 0.05) * 100) * 0.3 : 0;
    // 低频震动
    const rumble = Math.exp(-t * 5) * 0.1 * Math.sin(t * 200 * Math.PI);
    data[i] = (shake + rumble);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.4;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start();
}

// 生成落地沉闷声
function createLandingSound(ctx: AudioContext, intensity: number = 1): void {
  const duration = 0.2;
  const sampleRate = ctx.sampleRate;
  const bufferSize = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    // 低频撞击
    const impact = Math.exp(-t * 40) * 0.5 * Math.sin(t * 150 * Math.PI);
    // 中频共鸣
    const resonance = Math.exp(-t * 20) * 0.3 * Math.sin(t * 300 * Math.PI);
    data[i] = (impact + resonance) * intensity;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.6;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start();
}

// 播放摇卦开始音效（摇晃声）
export function playShakeSound(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    createShakeSound(ctx);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// 播放铜钱碰撞音效
export function playCoinCollisionSound(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    createCoinImpactSound(ctx, 0.8);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// 播放落地音效
export function playLandingSound(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    createLandingSound(ctx, 1);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// 播放最终确认音效（沉稳的叮声）
export function playConfirmSound(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    createLandingSound(ctx, 0.5);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// 播放动爻激活音效
export function playChangingYaoSound(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const duration = 0.5;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      // 缓慢上升的能量
      const energy = (1 - Math.exp(-t * 3)) * Math.exp(-t * 2);
      // 轻微的金属光泽
      const shimmer = energy * 0.3 * Math.sin(t * 2000 * Math.PI + t * 500 * Math.PI);
      data[i] = shimmer;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.3;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}
