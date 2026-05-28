// ============================================================
// physicalAnimation.ts —— 物理动画引擎（真实物理版）
// 抛物线 · 重力 · 惯性 · 弹性碰撞 · 摩擦减速 · 独立运动
// ============================================================

export interface CoinPhysics {
  /** 当前 X 位置 */
  x: number;
  /** 当前 Y 位置（向上为正） */
  y: number;
  /** X 方向速度 */
  vx: number;
  /** Y 方向速度（向上为正） */
  vy: number;
  /** 角速度 (度/帧) */
  angularVelocity: number;
  /** 当前旋转角度 */
  rotation: number;
  /** 弹性系数 */
  restitution: number;
  /** 摩擦系数 */
  friction: number;
  /** 地面位置 Y 坐标 */
  floorY: number;
  /** 是否已静止 */
  settled: boolean;
  /** 弹跳次数 */
  bounceCount: number;
  /** 最大弹跳次数 */
  maxBounces: number;
  /** 翻转次数（完成的全翻转） */
  flipCount: number;
  /** 当前运动阶段 */
  stage: 'ready' | 'rising' | 'flipping' | 'falling' | 'bouncing' | 'sliding' | 'settling' | 'stopped';
  /** 滚动距离 */
  slideDistance: number;
  /** 是否已揭示 */
  revealed: boolean;
}

export interface PhysicsConfig {
  /** 重力加速度 (px/frame²) */
  gravity: number;
  /** 地面 Y 坐标 */
  floorY: number;
  /** 最小弹性系数 */
  minRestitution: number;
  /** 最大弹性系数 */
  maxRestitution: number;
  /** 摩擦系数 */
  friction: number;
  /** 停止阈值 */
  stopThreshold: number;
}

const DEFAULT_CONFIG: PhysicsConfig = {
  gravity: 0.42,        // 略低于真实重力，增加飘逸感
  floorY: 140,           // 下落距离
  minRestitution: 0.25, // 弹跳能量保留
  maxRestitution: 0.35,
  friction: 0.48,       // 桌面摩擦
  stopThreshold: 0.5,
};

/** 生成单枚铜钱的随机物理参数 */
export function generateCoinPhysics(config: Partial<PhysicsConfig> = {}): CoinPhysics {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // 随机参数（符合时间线规范）
  const vx = (Math.random() - 0.5) * 120;           // X 方向随机偏移
  const vy = -(300 + Math.random() * 60);           // 向上抛出
  const angularVelocity = (600 + Math.random() * 500) * (Math.random() > 0.5 ? 1 : -1);
  const restitution = cfg.minRestitution + Math.random() * (cfg.maxRestitution - cfg.minRestitution);
  const maxBounces = 2 + Math.floor(Math.random() * 2); // 2-3次弹跳

  return {
    x: 0,
    y: 0,
    vx,
    vy,
    angularVelocity,
    rotation: Math.random() * 360,
    restitution,
    friction: cfg.friction,
    floorY: cfg.floorY,
    settled: false,
    bounceCount: 0,
    maxBounces,
    flipCount: 0,
    stage: 'ready',
    slideDistance: 0,
    revealed: false,
  };
}

/** 启动铜钱（从 ready 到 rising） */
export function launchCoin(coin: CoinPhysics): CoinPhysics {
  if (coin.stage !== 'ready') return coin;
  return {
    ...coin,
    stage: 'rising',
  };
}

/** 单帧物理更新 */
export function updatePhysics(coin: CoinPhysics, deltaTime: number = 1): CoinPhysics {
  const dt = Math.min(deltaTime / 16.67, 2); // 限制最大 dt，防止跳帧
  const newCoin = { ...coin };

  if (newCoin.settled || newCoin.stage === 'ready') {
    return newCoin;
  }

  // 通用重力
  const applyGravity = () => {
    newCoin.vy += DEFAULT_CONFIG.gravity * dt;
  };

  switch (newCoin.stage) {
    case 'rising':
      // 向上运动阶段（被重力减速）
      applyGravity();
      newCoin.y += newCoin.vy * dt;
      newCoin.x += newCoin.vx * dt * 0.2;
      newCoin.rotation += newCoin.angularVelocity * dt * 0.5;

      // 跟踪翻转
      newCoin.flipCount = Math.abs(newCoin.rotation) / 360;

      // 到达最高点，速度反向
      if (newCoin.vy >= 0) {
        newCoin.stage = 'flipping';
      }
      break;

    case 'flipping':
      // 空中翻转阶段（下落但保持旋转）
      applyGravity();
      newCoin.y += newCoin.vy * dt;
      newCoin.rotation += newCoin.angularVelocity * dt;

      // 跟踪翻转
      newCoin.flipCount = Math.abs(newCoin.rotation) / 360;

      // 接近地面时切换到下落
      if (newCoin.y > newCoin.floorY * 0.6) {
        newCoin.stage = 'falling';
      }
      break;

    case 'falling':
      // 快速下落阶段
      applyGravity();
      newCoin.y += newCoin.vy * dt;
      newCoin.rotation += newCoin.angularVelocity * dt * 0.6;

      // 检测首次接触地面
      if (newCoin.y >= newCoin.floorY) {
        newCoin.y = newCoin.floorY;
        newCoin.stage = 'bouncing';
        newCoin.bounceCount = 1;

        // 反弹（能量衰减）
        newCoin.vy = -newCoin.vy * newCoin.restitution;
        newCoin.vx *= (1 - newCoin.friction * 0.3);
      }
      break;

    case 'bouncing':
      // 弹跳阶段
      applyGravity();
      newCoin.y += newCoin.vy * dt;

      // 水平滑动
      newCoin.x += newCoin.vx * dt;
      newCoin.slideDistance += Math.abs(newCoin.vx * dt);
      newCoin.rotation += newCoin.angularVelocity * dt * 0.3;

      if (newCoin.y >= newCoin.floorY) {
        newCoin.y = newCoin.floorY;

        // 再次弹起或进入滑动
        if (newCoin.vy < -8) {
          // 还能弹起来
          newCoin.vy = -newCoin.vy * newCoin.restitution;
          newCoin.vx *= (1 - newCoin.friction * 0.2);
          newCoin.bounceCount++;
        } else {
          // 能量不足，进入滑动
          newCoin.stage = 'sliding';
          newCoin.vy = 0;
        }
      }
      break;

    case 'sliding':
      // 滑动减速阶段
      newCoin.vx *= (1 - newCoin.friction * 0.15);
      newCoin.x += newCoin.vx * dt;
      newCoin.slideDistance += Math.abs(newCoin.vx * dt);
      newCoin.rotation += newCoin.angularVelocity * dt * 0.1;

      // 检查是否停止
      const totalVel = Math.sqrt(newCoin.vx ** 2 + newCoin.vy ** 2);
      if (totalVel < DEFAULT_CONFIG.stopThreshold) {
        newCoin.stage = 'settling';
        newCoin.vx = 0;
        newCoin.vy = 0;
        newCoin.angularVelocity = 0;
      }
      break;

    case 'settling':
      // 最终微调（可能有1-2次小弹跳）
      applyGravity();
      newCoin.y = Math.min(newCoin.y + newCoin.vy * dt, newCoin.floorY);
      newCoin.vx *= (1 - newCoin.friction * 0.3);

      if (newCoin.y >= newCoin.floorY && Math.abs(newCoin.vy) < 1) {
        newCoin.settled = true;
        newCoin.stage = 'stopped';
      }
      break;

    case 'stopped':
      newCoin.settled = true;
      break;
  }

  return newCoin;
}

/** 生成三枚铜钱的独立物理参数 */
export function generateTrioPhysics(): {
  coins: CoinPhysics[];
  delays: number[]; // 启动延迟 (ms)
} {
  const coins: CoinPhysics[] = [];
  const delays: number[] = [];

  for (let i = 0; i < 3; i++) {
    coins.push(generateCoinPhysics({
      gravity: 0.38 + Math.random() * 0.12,
    }));
    // 每枚铜钱有不同延迟
    delays.push(i * 80 + Math.random() * 80);
  }

  return { coins, delays };
}

/** 计算透视缩放 */
export function getCoinScale(coin: CoinPhysics): number {
  if (coin.stage === 'ready' || coin.stage === 'stopped') return 1;
  const depthFactor = 1 - (coin.y / coin.floorY) * 0.12;
  return Math.max(0.88, Math.min(1.08, depthFactor));
}

/** 计算 X 轴倾斜（模拟 3D 翻转） */
export function getCoinTiltX(coin: CoinPhysics): number {
  if (coin.stage === 'ready' || coin.stage === 'stopped') return 0;

  // 根据翻转进度计算倾斜
  const flipProgress = coin.flipCount % 1;
  const tiltRange = 75;

  if (coin.stage === 'rising') {
    return -tiltRange * (1 - flipProgress);
  }
  if (coin.stage === 'flipping' || coin.stage === 'falling') {
    return Math.sin(flipProgress * Math.PI) * tiltRange;
  }
  if (coin.stage === 'bouncing') {
    return coin.vy < 0 ? -15 : 15;
  }

  return 0;
}

/** 检查是否应该揭示结果 */
export function shouldReveal(coin: CoinPhysics): boolean {
  // 只有在静止后才能揭示
  return coin.settled && coin.stage === 'stopped';
}
