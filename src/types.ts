/**
 * @description 触发渠道类型
 */
export type ActivationChannel = 'query' | 'storage' | 'gesture' | 'shortcut' | 'api';

/**
 * @description vConsole触发器配置选项
 */
export interface VConsoleTriggerOptions {
  /**
   * @description URL查询参数键名列表
   * @default ['debug_vconsole', 'vconsole']
   */
  queryKeys?: string[];

  /**
   * @description sessionStorage存储键名
   * @default 'VCONSOLE_ENABLED'
   */
  storageKey?: string;

  /**
   * @description 多点触控时间窗口（毫秒）
   * @default 2000
   */
  tapWindowMs?: number;

  /**
   * @description 触发所需的点击次数
   * @default 5
   */
  tapTargetCount?: number;

  /**
   * @description 热区宽度比例（相对于屏幕宽度）
   * @default 0.35
   */
  hotzoneWidthRatio?: number;

  /**
   * @description 热区高度比例（相对于屏幕高度，从底部开始）
   * @default 0.75
   */
  hotzoneHeightRatio?: number;

  /**
   * @description vConsole主题
   * @default 'dark'
   */
  theme?: 'dark' | 'light';

  /**
   * @description 全局API对象名称
   * @default 'VConsoleDebug'
   */
  globalApiName?: string;

  /**
   * @description 是否启用键盘快捷键（Ctrl/Cmd + Alt + V）
   * @default true
   */
  enableShortcut?: boolean;

  /**
   * @description 是否启用触摸手势
   * @default true
   */
  enableGesture?: boolean;
}

/**
 * @description 全局调试API接口
 */
export interface VConsoleDebugAPI {
  /**
   * @description 打开vConsole调试面板
   * @returns {Promise<void>}
   */
  open: () => Promise<void>;

  /**
   * @description 关闭vConsole调试面板并清除持久化标记
   */
  close: () => void;
}
