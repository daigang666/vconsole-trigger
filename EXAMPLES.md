# 使用示例

本文档提供 `@gangdai/vconsole-trigger` 在不同场景下的使用示例。

## 基础示例

### 最简单的用法

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 使用默认配置
await initVConsoleTrigger();
```

## 框架集成示例

### React + Vite

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';
import App from './App';
import './index.css';

// 初始化 vConsole 触发器
await initVConsoleTrigger({
  theme: 'dark',
  queryKeys: ['debug', 'vconsole'],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### React + UmiJS

```typescript
// src/app.tsx
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 在应用启动时初始化
await initVConsoleTrigger({
  storageKey: 'IAM_VCONSOLE_ENABLED',
  globalApiName: 'IAMDebugConsole',
});

export const request = {
  timeout: 10000,
  // ... 其他配置
};
```

### Vue 3 + Vite

```typescript
// src/main.ts
import { createApp } from 'vue';
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';
import App from './App.vue';

// 初始化 vConsole 触发器
await initVConsoleTrigger();

createApp(App).mount('#app');
```

### Next.js

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 仅在客户端初始化
    initVConsoleTrigger();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

## 高级配置示例

### 自定义触发区域和次数

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

await initVConsoleTrigger({
  // 扩大触发区域到屏幕左侧 50%
  hotzoneWidthRatio: 0.5,
  // 底部 30% 区域
  hotzoneHeightRatio: 0.7,
  // 只需连点 3 次
  tapTargetCount: 3,
  // 时间窗口延长到 3 秒
  tapWindowMs: 3000,
});
```

### 禁用特定触发方式

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 只允许通过 URL 参数和 API 触发，禁用手势和快捷键
await initVConsoleTrigger({
  enableGesture: false,
  enableShortcut: false,
});
```

### 多项目共存配置

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 为不同项目使用不同的配置
await initVConsoleTrigger({
  queryKeys: ['project_a_debug'],
  storageKey: 'PROJECT_A_VCONSOLE',
  globalApiName: 'ProjectADebug',
});
```

## 手动控制示例

### 使用类实例

```typescript
import { VConsoleTrigger } from '@gangdai/vconsole-trigger';

// 创建实例但不立即初始化
const trigger = new VConsoleTrigger({
  theme: 'light',
});

// 在需要时初始化
await trigger.init();

// 手动打开
document.getElementById('debug-btn')?.addEventListener('click', async () => {
  await trigger.open();
});

// 手动关闭
document.getElementById('close-btn')?.addEventListener('click', () => {
  trigger.close();
});
```

### 通过全局 API 控制

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 初始化时指定全局 API 名称
await initVConsoleTrigger({
  globalApiName: 'MyDebug',
});

// 在其他地方使用
declare global {
  interface Window {
    MyDebug: {
      open: () => Promise<void>;
      close: () => void;
    };
  }
}

// 打开调试面板
await window.MyDebug.open();

// 关闭调试面板
window.MyDebug.close();
```

## 条件性启用示例

### 仅在非生产环境启用

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// Vite 项目
if (import.meta.env.MODE !== 'production') {
  await initVConsoleTrigger();
}

// Create React App 项目
if (process.env.NODE_ENV !== 'production') {
  await initVConsoleTrigger();
}
```

### 根据用户角色启用

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 假设有一个获取用户信息的函数
async function initDebugTools() {
  const user = await getCurrentUser();

  // 仅为管理员或测试人员启用
  if (user.role === 'admin' || user.role === 'tester') {
    await initVConsoleTrigger();
  }
}

initDebugTools();
```

### 根据域名启用

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 仅在测试域名启用
if (window.location.hostname.includes('test') || window.location.hostname.includes('dev')) {
  await initVConsoleTrigger();
}
```

## 与其他工具集成示例

### 与 Sentry 集成

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';
import * as Sentry from '@sentry/react';

// 初始化 Sentry
Sentry.init({
  dsn: 'your-dsn',
  environment: import.meta.env.MODE,
});

// 初始化 vConsole 触发器
await initVConsoleTrigger({
  theme: 'dark',
});
```

### 与 Eruda 共存

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 根据不同条件使用不同的调试工具
if (window.location.search.includes('eruda')) {
  // 使用 Eruda
  import('eruda').then((eruda) => eruda.default.init());
} else {
  // 使用 vConsole
  await initVConsoleTrigger();
}
```

## 容器应用示例

### 在 WebView 中使用

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 初始化
await initVConsoleTrigger({
  globalApiName: 'WebViewDebug',
});

// 原生容器可以通过 JavaScript Bridge 调用
// Android WebView
if (window.AndroidBridge) {
  window.AndroidBridge.registerDebugCallback(() => {
    window.WebViewDebug.open();
  });
}

// iOS WKWebView
if (window.webkit?.messageHandlers?.debugHandler) {
  window.webkit.messageHandlers.debugHandler.postMessage('ready');
}
```

### 在 Electron 中使用

```typescript
// renderer.ts
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 初始化
await initVConsoleTrigger();

// 监听主进程的调试命令
window.electron?.ipcRenderer.on('toggle-debug', () => {
  window.VConsoleDebug.open();
});
```

## TypeScript 类型示例

### 完整类型定义

```typescript
import {
  VConsoleTrigger,
  initVConsoleTrigger,
  type VConsoleTriggerOptions,
  type ActivationChannel,
  type VConsoleDebugAPI,
} from '@gangdai/vconsole-trigger';

// 使用类型定义
const options: VConsoleTriggerOptions = {
  queryKeys: ['debug'],
  storageKey: 'MY_VCONSOLE',
  theme: 'dark',
  enableShortcut: true,
  enableGesture: true,
};

const trigger = new VConsoleTrigger(options);
await trigger.init();

// 扩展 Window 类型
declare global {
  interface Window {
    VConsoleDebug: VConsoleDebugAPI;
  }
}
```

## 调试技巧

### 监听激活事件

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 初始化
await initVConsoleTrigger();

// 监听 sessionStorage 变化来检测激活
window.addEventListener('storage', (e) => {
  if (e.key === 'VCONSOLE_ENABLED' && e.newValue === '1') {
    console.log('vConsole has been activated');
  }
});
```

### 添加自定义日志

```typescript
import { VConsoleTrigger } from '@gangdai/vconsole-trigger';

class CustomVConsoleTrigger extends VConsoleTrigger {
  async open() {
    console.log('[Debug] Opening vConsole...');
    await super.open();
    console.log('[Debug] vConsole opened');
  }

  close() {
    console.log('[Debug] Closing vConsole...');
    super.close();
    console.log('[Debug] vConsole closed');
  }
}

const trigger = new CustomVConsoleTrigger();
await trigger.init();
```

## 更多示例

查看 [GitHub Repository](https://github.com/daigang666/vconsole-trigger) 获取更多示例和最佳实践。
