# 迁移指南

本文档帮助你将现有项目中的 vConsole 触发逻辑迁移到 `@gangdai/vconsole-trigger`。

## 从 IAM-Login 迁移

如果你的项目是从 IAM-Login 复制的 vConsole 触发代码，可以按照以下步骤迁移。

### 迁移前

**IAM-Login 中的实现**：

```typescript
// src/utils/vconsole-trigger.ts
import type VConsole from 'vconsole';

const QUERY_KEYS = ['debug_vconsole', 'iam_debug', 'vconsole'];
const STORAGE_FLAG_KEY = 'IAM_LOGIN_VCONSOLE_ENABLED';
// ... 大量代码

export const initVConsoleTrigger = () => {
  // ... 实现逻辑
};
```

```typescript
// src/main.tsx
import { initVConsoleTrigger } from './utils/vconsole-trigger';

initVConsoleTrigger();
```

### 迁移后

**使用 npm 包**：

1. **安装依赖**：

```bash
pnpm add @gangdai/vconsole-trigger vconsole
```

2. **删除本地文件**：

删除以下文件：
- `src/utils/vconsole-trigger.ts`
- `src/types/vconsole.d.ts`（如果只用于 vconsole）
- `docs/vconsole-debug.md`（可选，保留作为使用说明）

3. **更新导入**：

```typescript
// src/main.tsx
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 使用相同的配置
await initVConsoleTrigger({
  queryKeys: ['debug_vconsole', 'iam_debug', 'vconsole'],
  storageKey: 'IAM_LOGIN_VCONSOLE_ENABLED',
  globalApiName: 'IAMDebugConsole',
  theme: 'dark',
});
```

4. **更新全局 API 类型定义**（如果需要）：

```typescript
// src/types/global.d.ts
import type { VConsoleDebugAPI } from '@gangdai/vconsole-trigger';

declare global {
  interface Window {
    IAMDebugConsole: VConsoleDebugAPI;
  }
}
```

### 配置映射

| IAM-Login 常量 | npm 包配置项 | 默认值 |
|---------------|-------------|--------|
| `QUERY_KEYS` | `queryKeys` | `['debug_vconsole', 'vconsole']` |
| `STORAGE_FLAG_KEY` | `storageKey` | `'VCONSOLE_ENABLED'` |
| `TAP_WINDOW_MS` | `tapWindowMs` | `2000` |
| `TAP_TARGET_COUNT` | `tapTargetCount` | `5` |
| `HOTZONE_WIDTH_RATIO` | `hotzoneWidthRatio` | `0.35` |
| `HOTZONE_HEIGHT_RATIO` | `hotzoneHeightRatio` | `0.75` |
| `window.IAMDebugConsole` | `globalApiName` | `'VConsoleDebug'` |

### 功能对比

| 功能 | IAM-Login | npm 包 |
|-----|----------|--------|
| URL 参数触发 | ✅ | ✅ |
| SessionStorage 持久化 | ✅ | ✅ |
| 多点触控手势 | ✅ | ✅ |
| 键盘快捷键 | ✅ | ✅ |
| 全局 API | ✅ | ✅ |
| 可配置性 | 有限 | 完全可配置 |
| TypeScript 支持 | ✅ | ✅ |
| 独立维护 | ❌ | ✅ |

## 从其他 vConsole 实现迁移

### 从简单的 vConsole 初始化迁移

**迁移前**：

```typescript
import VConsole from 'vconsole';

if (process.env.NODE_ENV !== 'production') {
  new VConsole();
}
```

**迁移后**：

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// 支持多种触发方式，不仅限于环境判断
await initVConsoleTrigger();
```

### 从 URL 参数触发迁移

**迁移前**：

```typescript
import VConsole from 'vconsole';

if (window.location.search.includes('debug')) {
  new VConsole();
}
```

**迁移后**：

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

await initVConsoleTrigger({
  queryKeys: ['debug'],
});
```

### 从 Eruda 迁移

**迁移前**：

```typescript
import eruda from 'eruda';

if (window.location.search.includes('debug')) {
  eruda.init();
}
```

**迁移后**：

```typescript
import { initVConsoleTrigger } from '@gangdai/vconsole-trigger';

// vConsole 提供类似功能，且更轻量
await initVConsoleTrigger({
  queryKeys: ['debug'],
});
```

## 迁移检查清单

- [ ] 安装 `@gangdai/vconsole-trigger` 和 `vconsole` 依赖
- [ ] 删除本地 vConsole 触发代码文件
- [ ] 更新导入语句
- [ ] 配置选项（如果需要自定义）
- [ ] 更新全局类型定义（如果使用 TypeScript）
- [ ] 测试所有触发方式
- [ ] 更新文档和注释
- [ ] 删除不再需要的依赖

## 常见问题

### Q: 迁移后原有的 URL 参数还能用吗？

A: 可以，通过配置 `queryKeys` 选项保持兼容：

```typescript
await initVConsoleTrigger({
  queryKeys: ['debug_vconsole', 'iam_debug', 'vconsole'], // 保留原有参数
});
```

### Q: 迁移后 sessionStorage 键名变了怎么办？

A: 配置 `storageKey` 选项保持一致：

```typescript
await initVConsoleTrigger({
  storageKey: 'IAM_LOGIN_VCONSOLE_ENABLED', // 使用原有键名
});
```

### Q: 全局 API 名称变了怎么办？

A: 配置 `globalApiName` 选项：

```typescript
await initVConsoleTrigger({
  globalApiName: 'IAMDebugConsole', // 使用原有名称
});
```

### Q: 迁移后如何验证功能正常？

A: 测试以下场景：

1. 访问 `?debug_vconsole` 参数，确认 vConsole 出现
2. 刷新页面，确认 vConsole 仍然存在（sessionStorage 持久化）
3. 在移动设备上测试手势触发
4. 在桌面浏览器测试快捷键 `Ctrl/Cmd + Alt + V`
5. 在控制台调用 `window.VConsoleDebug.open()` 和 `close()`

## 迁移收益

- ✅ **减少代码维护**：不再需要维护本地 vConsole 触发代码
- ✅ **统一更新**：通过 npm 更新获取新功能和 bug 修复
- ✅ **更好的类型支持**：完整的 TypeScript 类型定义
- ✅ **更高的可配置性**：灵活的配置选项
- ✅ **跨项目复用**：在多个项目中使用相同的调试工具

## 需要帮助？

如果在迁移过程中遇到问题，请：

1. 查看 [README.md](./README.md) 了解完整功能
2. 查看 [EXAMPLES.md](./EXAMPLES.md) 了解使用示例
3. 访问 [GitHub Issues](https://github.com/daigang666/vconsole-trigger/issues) 提问
