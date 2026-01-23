# @gangdai/vconsole-trigger

一个轻量级的 vConsole 触发器库，用于生产环境调试，支持多种激活方式。

[![npm version](https://img.shields.io/npm/v/@gangdai/vconsole-trigger.svg)](https://www.npmjs.com/package/@gangdai/vconsole-trigger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- 🚀 **零依赖**：仅 peer dependency 为 `vconsole`
- 📦 **轻量级**：打包后体积小，按需加载 vConsole
- 🎯 **多种触发方式**：URL参数、sessionStorage、手势、快捷键、API
- 🔧 **高度可配置**：支持自定义触发参数、热区、快捷键等
- 💪 **TypeScript 支持**：完整的类型定义
- 📱 **移动端友好**：支持触摸手势触发
- 🌐 **通用格式**：同时支持 CommonJS 和 ESM

## 安装

```bash
# 使用 pnpm
pnpm add @gangdai/vconsole-trigger vconsole

# 使用 npm
npm install @gangdai/vconsole-trigger vconsole

# 使用 yarn
yarn add @gangdai/vconsole-trigger vconsole
```

## 快速开始

### 基础用法

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 使用默认配置初始化
initVConsoleTrigger();
```

### 自定义配置

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

initVConsoleTrigger({
  queryKeys: ['debug', 'vconsole'],
  storageKey: 'MY_APP_VCONSOLE',
  theme: 'light',
  globalApiName: 'MyDebugConsole',
  enableShortcut: true,
  enableGesture: true,
});
```

### 手动控制

```typescript
import { VConsoleTrigger } from '@gangdai/vconsole-trigger';

const trigger = new VConsoleTrigger({
  theme: 'dark',
});

// 初始化
trigger.init();

// 手动打开
await trigger.open();

// 手动关闭
trigger.close();
```

## 触发方式

### 1. URL 参数触发

在访问地址后追加 `?debug_vconsole` 或 `?vconsole`（值可为空、`1`、`true`、`yes`、`on`）：

```
https://example.com/?debug_vconsole
https://example.com/?vconsole=1
https://example.com/#vconsole=true
```

### 2. SessionStorage 持久化

一旦通过任意方式打开 vConsole，会向 `sessionStorage` 写入标记，刷新页面后仍会自动拉起。

### 3. 多点触控手势

在触摸屏设备上，在 2 秒内于「屏幕左侧 35% × 底部 25%」区域连点 5 次即可触发。

### 4. 键盘快捷键

在可用键盘环境中按下 `Ctrl/Cmd + Alt + V`。

### 5. 全局 API

通过全局 API 手动控制：

```typescript
// 打开 vConsole
await window.VConsoleDebug.open();

// 关闭 vConsole
window.VConsoleDebug.close();
```

## 配置选项

```typescript
interface VConsoleTriggerOptions {
  /**
   * URL查询参数键名列表
   * @default ['debug_vconsole', 'vconsole']
   */
  queryKeys?: string[];

  /**
   * sessionStorage存储键名
   * @default 'VCONSOLE_ENABLED'
   */
  storageKey?: string;

  /**
   * 多点触控时间窗口（毫秒）
   * @default 2000
   */
  tapWindowMs?: number;

  /**
   * 触发所需的点击次数
   * @default 5
   */
  tapTargetCount?: number;

  /**
   * 热区宽度比例（相对于屏幕宽度）
   * @default 0.35
   */
  hotzoneWidthRatio?: number;

  /**
   * 热区高度比例（相对于屏幕高度，从底部开始）
   * @default 0.75
   */
  hotzoneHeightRatio?: number;

  /**
   * vConsole主题
   * @default 'dark'
   */
  theme?: 'dark' | 'light';

  /**
   * 全局API对象名称
   * @default 'VConsoleDebug'
   */
  globalApiName?: string;

  /**
   * 是否启用键盘快捷键（Ctrl/Cmd + Alt + V）
   * @default true
   */
  enableShortcut?: boolean;

  /**
   * 是否启用触摸手势
   * @default true
   */
  enableGesture?: boolean;
}
```

## API

### `initVConsoleTrigger(options?: VConsoleTriggerOptions): VConsoleTrigger`

创建并初始化 vConsole 触发器的便捷函数。

### `VConsoleTrigger`

vConsole 触发器类。

#### 方法

- `init(): void` - 初始化触发器
- `open(): Promise<void>` - 手动打开 vConsole
- `close(): void` - 手动关闭 vConsole

## 使用场景

### React 应用

```typescript
// main.tsx 或 index.tsx
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 在应用启动时初始化
initVConsoleTrigger();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

### Vue 应用

```typescript
// main.ts
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 在应用启动时初始化
initVConsoleTrigger();

createApp(App).mount('#app');
```

### 原生 JavaScript

```html
<script type="module">
  import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';
  initVConsoleTrigger();
</script>
```

## 关闭 & 清理

- 使用全局 API：`window.VConsoleDebug.close()`
- 或从浏览器 DevTools > Application > Session Storage 中删除对应的存储键
- 或刷新后不再带调试参数

## 浏览器兼容性

- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 移动端浏览器（iOS Safari、Chrome Mobile、Android WebView）
- 支持 ES2020+ 特性

## 许可证

MIT © [Gang Dai](https://github.com/daigang666)

## 相关链接

- [vConsole](https://github.com/Tencent/vConsole) - 腾讯开源的移动端调试工具
- [GitHub Repository](https://github.com/daigang666/vconsole-trigger)
- [Issues](https://github.com/daigang666/vconsole-trigger/issues)
