# 快速开始

本文档帮助你快速在项目中集成 `@gangdai/vconsole-trigger`。

## 安装

```bash
pnpm add @gangdai/vconsole-trigger vconsole
```

## 基础集成

### React 项目

在应用入口文件（如 `main.tsx` 或 `index.tsx`）中初始化：

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';
import ReactDOM from 'react-dom/client';
import App from './App';

// 初始化 vConsole 触发器
initVConsoleTrigger();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

### Vue 项目

在应用入口文件（如 `main.ts`）中初始化：

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';
import { createApp } from 'vue';
import App from './App.vue';

// 初始化 vConsole 触发器
initVConsoleTrigger();

createApp(App).mount('#app');
```

### UmiJS 项目

在 `src/app.tsx` 或 `src/app.ts` 中初始化：

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 初始化 vConsole 触发器
initVConsoleTrigger();

export const request = {
  // ... 你的请求配置
};
```

## 使用方式

集成完成后，你可以通过以下任意方式触发 vConsole：

### 1. URL 参数

在浏览器地址栏添加参数：

```
https://your-app.com/?debug_vconsole
https://your-app.com/?vconsole=1
```

### 2. 触摸手势

在移动设备上，在屏幕左下角区域（左侧 35% × 底部 25%）快速连点 5 次。

### 3. 键盘快捷键

在桌面浏览器中按下 `Ctrl + Alt + V`（Mac 上是 `Cmd + Alt + V`）。

### 4. 代码调用

在浏览器控制台或代码中调用：

```javascript
// 打开 vConsole
await window.VConsoleDebug.open();

// 关闭 vConsole
window.VConsoleDebug.close();
```

## 自定义配置

如果需要自定义配置，可以传入选项：

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

initVConsoleTrigger({
  // 自定义 URL 参数键名
  queryKeys: ['debug', 'vconsole'],

  // 自定义 sessionStorage 键名
  storageKey: 'MY_APP_VCONSOLE',

  // 使用浅色主题
  theme: 'light',

  // 自定义全局 API 名称
  globalApiName: 'MyDebugConsole',

  // 禁用键盘快捷键
  enableShortcut: false,

  // 禁用触摸手势
  enableGesture: false,
});
```

## 验证集成

1. 启动你的应用
2. 在浏览器地址栏添加 `?debug_vconsole` 参数
3. 刷新页面
4. 应该能看到 vConsole 调试面板出现在页面右下角

## 常见问题

### Q: vConsole 没有出现？

A: 检查以下几点：
- 确认已正确安装 `vconsole` 依赖
- 确认 `initVConsoleTrigger()` 在应用启动时被调用
- 检查浏览器控制台是否有错误信息
- 尝试使用不同的触发方式

### Q: 如何在生产环境禁用？

A: 你可以根据环境变量条件性地初始化：

```typescript
if (import.meta.env.MODE !== 'production') {
  initVConsoleTrigger();
}
```

或者保留触发器，但只在需要时通过 URL 参数激活，这样不会影响正常用户。

### Q: 如何自定义触发区域？

A: 通过配置选项调整热区大小：

```typescript
initVConsoleTrigger({
  hotzoneWidthRatio: 0.5,   // 屏幕左侧 50%
  hotzoneHeightRatio: 0.8,  // 屏幕底部 20%
  tapTargetCount: 3,        // 连点 3 次即可触发
});
```

## 下一步

- 查看 [README.md](./README.md) 了解完整功能
- 查看 [PUBLISH.md](./PUBLISH.md) 了解如何发布到 npm
- 访问 [GitHub Issues](https://github.com/daigang666/vconsole-trigger/issues) 报告问题或提出建议
