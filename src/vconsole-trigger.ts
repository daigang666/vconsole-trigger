import type VConsole from 'vconsole';
import type { ActivationChannel, VConsoleTriggerOptions, VConsoleDebugAPI } from './types';

/**
 * @description 默认配置
 */
const DEFAULT_OPTIONS: Required<VConsoleTriggerOptions> = {
  queryKeys: ['debug_vconsole', 'vconsole'],
  storageKey: 'VCONSOLE_ENABLED',
  tapWindowMs: 2000,
  tapTargetCount: 5,
  hotzoneWidthRatio: 0.35,
  hotzoneHeightRatio: 0.75,
  theme: 'dark',
  globalApiName: 'VConsoleDebug',
  enableShortcut: true,
  enableGesture: true,
};

/**
 * @description 真值集合
 */
const TRUTHY_VALUES = new Set(['1', 'true', 'yes', 'on']);

/**
 * @description vConsole触发器类
 */
export class VConsoleTrigger {
  private options: Required<VConsoleTriggerOptions>;
  private tapHistory: number[] = [];
  private initDone = false;
  private vConsoleInstance: VConsole | null = null;
  private loadingPromise: Promise<VConsole | null> | null = null;

  constructor(options?: VConsoleTriggerOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * @description 判断是否在多点触发区域内
   * @param {number} clientX 触点的横坐标
   * @param {number} clientY 触点的纵坐标
   * @returns {boolean} 是否命中热区
   */
  private isInHotZone(clientX: number, clientY: number): boolean {
    const { innerWidth, innerHeight } = window;
    const thresholdX = innerWidth * this.options.hotzoneWidthRatio;
    const thresholdY = innerHeight * this.options.hotzoneHeightRatio;
    return clientX <= thresholdX && clientY >= thresholdY;
  }

  /**
   * @description 判断触控是否可用
   * @returns {boolean} 设备是否支持触控
   */
  private isTouchCapable(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * @description 读取URL参数中的调试标记
   * @returns {boolean} 是否需要自动开启vConsole
   */
  private shouldEnableFromQuery(): boolean {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    const isTruthy = (value: string | null): boolean => {
      if (value === null || value === '') {
        return true;
      }
      return TRUTHY_VALUES.has(value.toLowerCase());
    };

    const matchParams = (params: URLSearchParams): boolean =>
      this.options.queryKeys.some((key) => params.has(key) && isTruthy(params.get(key)));

    return matchParams(searchParams) || matchParams(hashParams);
  }

  /**
   * @description 读取会话存储中的调试标记
   * @returns {boolean} 是否需要自动开启vConsole
   */
  private shouldEnableFromStorage(): boolean {
    try {
      return sessionStorage.getItem(this.options.storageKey) === '1';
    } catch (error) {
      window.console?.warn?.('sessionStorage is unavailable, skip persisted vConsole flag', error);
      return false;
    }
  }

  /**
   * @description 将激活状态写入会话存储
   */
  private persistActivationFlag(): void {
    try {
      sessionStorage.setItem(this.options.storageKey, '1');
    } catch (error) {
      window.console?.warn?.('sessionStorage is unavailable, skip persisting vConsole flag', error);
    }
  }

  /**
   * @description 清理激活状态
   */
  private clearActivationFlag(): void {
    try {
      sessionStorage.removeItem(this.options.storageKey);
    } catch (error) {
      window.console?.warn?.('sessionStorage is unavailable, skip clearing vConsole flag', error);
    }
  }

  /**
   * @description 按需加载并实例化vConsole
   * @param {ActivationChannel} channel 触发来源
   * @returns {Promise<VConsole | null>} vConsole实例
   */
  private async enableVConsole(channel: ActivationChannel): Promise<VConsole | null> {
    if (this.vConsoleInstance) {
      return this.vConsoleInstance;
    }

    if (!this.loadingPromise) {
      this.loadingPromise = import('vconsole')
        .then(({ default: VConsoleClass }) => {
          this.vConsoleInstance = new VConsoleClass({ theme: this.options.theme });
          this.persistActivationFlag();
          window.console?.info?.(`[vConsole] activated via ${channel}`);
          return this.vConsoleInstance;
        })
        .catch((error) => {
          window.console?.error?.('Failed to bootstrap vConsole', error);
          this.loadingPromise = null;
          return null;
        });
    }

    return this.loadingPromise;
  }

  /**
   * @description 手动销毁vConsole实例
   */
  private destroyVConsole(): void {
    if (!this.vConsoleInstance) {
      return;
    }
    this.vConsoleInstance.destroy();
    this.vConsoleInstance = null;
    this.loadingPromise = null;
    this.clearActivationFlag();
  }

  /**
   * @description 处理键盘快捷键（Ctrl/Command + Alt + V）触发
   * @param {KeyboardEvent} event 键盘事件
   */
  private handleKeydown = (event: KeyboardEvent): void => {
    const isModifierPressed = event.altKey && (event.ctrlKey || event.metaKey);
    if (!isModifierPressed || event.code !== 'KeyV') {
      return;
    }
    event.preventDefault();
    void this.enableVConsole('shortcut');
  };

  /**
   * @description 记录多次点击事件并判断是否满足触发条件
   */
  private handleTouchStart = (event: TouchEvent): void => {
    const touchPoint = event.changedTouches[0] ?? event.touches[0];
    if (!touchPoint) {
      return;
    }

    if (!this.isInHotZone(touchPoint.clientX, touchPoint.clientY)) {
      this.tapHistory = [];
      return;
    }

    const now = Date.now();
    this.tapHistory = this.tapHistory.filter(
      (timestamp) => now - timestamp <= this.options.tapWindowMs
    );
    this.tapHistory.push(now);

    if (this.tapHistory.length >= this.options.tapTargetCount) {
      this.tapHistory = [];
      void this.enableVConsole('gesture');
    }
  };

  /**
   * @description 注册Window级别的手动调试接口
   */
  private registerWindowBridge(): void {
    const api: VConsoleDebugAPI = {
      open: async () => {
        await this.enableVConsole('api');
      },
      close: () => this.destroyVConsole(),
    };

    // 使用配置的全局API名称
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[this.options.globalApiName] = api;
  }

  /**
   * @description 初始化vConsole触发器
   */
  public init(): void {
    if (typeof window === 'undefined' || this.initDone) {
      return;
    }

    this.initDone = true;
    this.registerWindowBridge();

    // 检查URL参数或sessionStorage
    if (this.shouldEnableFromQuery()) {
      void this.enableVConsole('query');
    } else if (this.shouldEnableFromStorage()) {
      void this.enableVConsole('storage');
    }

    // 注册键盘快捷键
    if (this.options.enableShortcut) {
      window.addEventListener('keydown', this.handleKeydown);
    }

    // 注册触摸手势
    if (this.options.enableGesture && this.isTouchCapable()) {
      window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    }
  }

  /**
   * @description 手动打开vConsole
   * @returns {Promise<void>}
   */
  public async open(): Promise<void> {
    await this.enableVConsole('api');
    return;
  }

  /**
   * @description 手动关闭vConsole
   */
  public close(): void {
    this.destroyVConsole();
  }
}

/**
 * @description 创建并初始化vConsole触发器（便捷函数）
 * @param {VConsoleTriggerOptions} options 配置选项
 * @returns {VConsoleTrigger} 触发器实例
 */
export function initVConsoleTrigger(options?: VConsoleTriggerOptions): VConsoleTrigger {
  const trigger = new VConsoleTrigger(options);
  trigger.init();
  return trigger;
}
