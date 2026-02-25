# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@gangdai/vconsole-trigger` — a lightweight library that lazily loads and activates [vConsole](https://github.com/nicehash/nicehash-exchange/tree/master/packages/vconsole) in production via multiple trigger methods (URL params, sessionStorage, touch gestures, keyboard shortcuts, programmatic API). Zero runtime dependencies; `vconsole` is a peer dependency.

## Commands

```bash
pnpm install               # Install dependencies
pnpm build                 # Production build (CJS + ESM + .d.ts via tsup)
pnpm dev                   # Watch mode (auto-rebuild on change)
pnpm run type-check        # TypeScript type check (tsc --noEmit)
pnpm run lint              # ESLint
```

No test framework is configured yet.

## Architecture

The entire library lives in four source files under `src/`:

- `types.ts` — `VConsoleTriggerOptions`, `VConsoleDebugAPI`, `ActivationChannel` type definitions
- `vconsole-trigger.ts` — Core `VConsoleTrigger` class and `initVConsoleTrigger()` convenience function
- `vconsole.d.ts` — Type declaration for the `vconsole` peer dependency
- `index.ts` — Public barrel export

### VConsoleTrigger class (vconsole-trigger.ts)

Single class that owns the full lifecycle:

1. **Detection** — `init()` checks URL query params and sessionStorage for debug flags; if found, eagerly loads vConsole.
2. **Lazy loading** — `enableVConsole()` dynamically imports `vconsole` on first activation, caches the promise to avoid duplicate loads, and persists the enabled state to sessionStorage.
3. **Trigger channels** — After init, registers touch gesture listener (bottom-left hot zone, configurable tap count/window) and keyboard shortcut (`Ctrl/Cmd+Alt+V`). Also exposes a global API object (`window.VConsoleDebug` by default) for programmatic open/close.
4. **Teardown** — `destroyVConsole()` removes the vConsole instance and clears the sessionStorage flag.

### Build

tsup bundles `src/index.ts` into `dist/` producing CJS (`.js`), ESM (`.mjs`), declarations (`.d.ts`, `.d.mts`), and source maps. Target is ES2020. No minification; tree-shaking enabled.

## Conventions

- Comments and documentation in Chinese (中文)
- Strict TypeScript (`strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`)
- ESLint rule: `@typescript-eslint/no-explicit-any` is `warn` (avoid `any`)
- Package manager: pnpm
- Publishing: see `PUBLISH.md` for manual npm publish steps
