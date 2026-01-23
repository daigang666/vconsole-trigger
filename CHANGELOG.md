# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-22

### Added

- 初始版本发布
- 支持多种 vConsole 触发方式：
  - URL 参数触发（`?debug_vconsole` 或 `?vconsole`）
  - SessionStorage 持久化
  - 多点触控手势（屏幕左下角连点 5 次）
  - 键盘快捷键（Ctrl/Cmd + Alt + V）
  - 全局 API 手动控制
- 高度可配置的触发参数
- 完整的 TypeScript 类型定义
- 支持 CommonJS 和 ESM 双格式
- 零依赖（仅 peer dependency 为 vconsole）
