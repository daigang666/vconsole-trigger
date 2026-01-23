# 发布指南

本文档说明如何将 `@gangdai/vconsole-trigger` 发布到 npm。

## 前置条件

1. **npm 账号**：确保你有 npm 账号，如果没有请在 [npmjs.com](https://www.npmjs.com/) 注册
2. **npm 登录**：在本地登录 npm 账号

```bash
npm login
```

3. **配置 npm 源**：确保使用官方 npm 源

```bash
# 查看当前源
npm config get registry

# 如果不是官方源，设置为官方源
npm config set registry https://registry.npmjs.org/
```

或者复制 `.npmrc.example` 为 `.npmrc`：

```bash
cp .npmrc.example .npmrc
```

## 发布步骤

### 1. 更新版本号

根据语义化版本规范更新 `package.json` 中的版本号：

- **补丁版本**（bug 修复）：`1.0.0` → `1.0.1`
- **次版本**（新功能，向后兼容）：`1.0.0` → `1.1.0`
- **主版本**（破坏性变更）：`1.0.0` → `2.0.0`

```bash
# 手动编辑 package.json 中的 version 字段
# 或使用 npm version 命令
npm version patch  # 补丁版本
npm version minor  # 次版本
npm version major  # 主版本
```

### 2. 更新 CHANGELOG

在 `CHANGELOG.md` 中记录本次发布的变更内容。

### 3. 构建项目

```bash
pnpm build
```

确保构建成功，检查 `dist/` 目录下的文件：

```
dist/
├── index.js          # CommonJS 格式
├── index.js.map
├── index.mjs         # ESM 格式
├── index.mjs.map
├── index.d.ts        # TypeScript 类型定义
└── index.d.mts
```

### 4. 运行测试和检查

```bash
# TypeScript 类型检查
pnpm type-check

# ESLint 检查
pnpm lint
```

### 5. 发布到 npm

```bash
# 使用 pnpm 发布（推荐）
pnpm publish

# 或使用 npm 发布
npm publish
```

**注意**：`prepublishOnly` 脚本会在发布前自动运行 `pnpm build`，确保发布的是最新构建。

### 6. 验证发布

发布成功后，访问 npm 包页面验证：

```
https://www.npmjs.com/package/@gangdai/vconsole-trigger
```

### 7. 创建 Git 标签（可选）

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 发布检查清单

- [ ] 更新版本号
- [ ] 更新 CHANGELOG.md
- [ ] 运行 `pnpm build` 构建成功
- [ ] 运行 `pnpm type-check` 无错误
- [ ] 运行 `pnpm lint` 无错误
- [ ] 确认 npm 已登录
- [ ] 确认使用正确的 npm 源
- [ ] 执行 `pnpm publish`
- [ ] 验证 npm 包页面
- [ ] 创建 Git 标签并推送

## 撤销发布

如果发布后发现问题，可以在 72 小时内撤销发布：

```bash
npm unpublish @gangdai/vconsole-trigger@<version>
```

**警告**：撤销发布会影响已经使用该版本的用户，请谨慎操作。

## 发布私有包（可选）

如果需要发布到私有 npm 源：

1. 修改 `.npmrc` 文件，设置私有源地址
2. 修改 `package.json` 中的 `publishConfig`：

```json
{
  "publishConfig": {
    "registry": "https://your-private-registry.com/",
    "access": "restricted"
  }
}
```

3. 登录私有源并发布：

```bash
npm login --registry=https://your-private-registry.com/
npm publish
```

## 常见问题

### 1. 发布失败：403 Forbidden

- 确认已登录 npm：`npm whoami`
- 确认包名未被占用
- 确认有发布权限（对于 scoped packages）

### 2. 发布失败：版本号已存在

- 更新版本号后再发布
- 不能发布已存在的版本号

### 3. 发布后无法安装

- 等待几分钟，npm CDN 需要同步时间
- 清除本地缓存：`npm cache clean --force`

## 相关资源

- [npm 发布文档](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [npm 包命名规范](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#name)
