/**
 * @description vConsole最小类型定义
 */
declare module 'vconsole' {
  /**
   * @description vConsole初始化配置
   */
  export type VConsoleOptions = {
    theme?: 'dark' | 'light';
    maxLogNumber?: number;
    disableLogScrolling?: boolean;
  };

  /**
   * @description vConsole实例类型定义
   */
  export default class VConsole {
    constructor(options?: VConsoleOptions);
    public setSwitchPosition(position: { x: number; y: number }): void;
    public showSwitch(): void;
    public hideSwitch(): void;
    public destroy(): void;
  }
}
