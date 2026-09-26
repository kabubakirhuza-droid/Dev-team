# AI Dev Team — Phase 1

Каркас: Electron + React + TypeScript, строгое разделение main/renderer,
SQLite с миграциями, TaskManager/ConversationManager/ActivityLog,
WorkflowEngine как безопасная заглушка.

Согласно Phase 1: без Playwright, без ChatGPT/ClaudeAdapter, без Local
Executor, без автоматического workflow — см. `architecture-v2.md` из
предыдущего сообщения.

## Установка

```bash
npm install
```

Используется `better-sqlite3` (нативный модуль). При установке `postinstall`
автоматически пересобирает его под ABI Electron через `@electron/rebuild` —
обычно без Visual Studio (см. раздел Troubleshooting ниже, если всё же
потребуется).

Если хотите пропустить скачивание бинарника Electron (не нужен для
build/typecheck, только для `npm start`) — в PowerShell:

```powershell
$env:ELECTRON_SKIP_BINARY_DOWNLOAD="1"
npm install
```

Для реального запуска (`npm start`) переустановите без этой переменной,
чтобы Electron скачал свой бинарник:

```powershell
npm install
```

## Команды

```bash
npm run typecheck   # tsc --noEmit для main и renderer раздельно
npm run build        # компиляция main (tsc) + сборка renderer (vite)
npm run dev:renderer # vite dev server (для разработки renderer отдельно)
npm start             # запуск Electron (нужен собранный dist/ и dist-electron/)
```

Для полноценного запуска GUI:

```bash
npm run build
npm start
```

## Troubleshooting: allow-scripts блокирует postinstall у electron/esbuild

Если в системе установлен security-инструмент, перехватывающий install
scripts (сообщение вида `npm warn allow-scripts ... not yet covered by
allowScripts`), то `electron` и `esbuild` могут не выполнить свой
postinstall (а значит, бинарник Electron не скачается). Разрешите их
явно:

```powershell
npm approve-scripts electron
npm approve-scripts esbuild
npm install
```

Проверить, что бинарник Electron реально появился:

```powershell
Test-Path node_modules\electron\dist\electron.exe
```

Должно быть `True`.

## Troubleshooting: better-sqlite3 на Windows

`better-sqlite3` — нативный модуль. При `npm install` он должен пересобраться
под ABI Electron (не системного Node) — это делает пакет `@electron/rebuild`
через `postinstall`-хук (уже настроен в `package.json`), обычно без
Visual Studio.

Если `npm install` всё равно падает на сборке `better-sqlite3` /
`electron-rebuild` с ошибкой `Could not find any Visual Studio installation`:

1. Убедитесь, что установка идёт БЕЗ `ELECTRON_SKIP_BINARY_DOWNLOAD` —
   `electron-rebuild` работает надёжнее, когда Electron скачан полностью:

   ```powershell
   Remove-Item Env:\ELECTRON_SKIP_BINARY_DOWNLOAD -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
   npm install
   ```

2. Если ошибка повторяется — прекомпилированного бинарника для вашей
   версии Electron/Node/архитектуры нет, и нужен C++ toolchain:
   - скачайте "Build Tools for Visual Studio" —
     https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - при установке выберите workload **"Desktop development with C++"**
   - перезапустите PowerShell и повторите `npm install`.

3. Если после этого install проходит, но `npm start` падает с ошибкой вида
   `was compiled against a different Node.js version` — значит модуль
   собрался под системный Node, а не под Electron; выполните вручную:

   ```powershell
   npx electron-rebuild -f -w better-sqlite3
   ```

## Известные ограничения Phase 1

- SQLite-база — глобальная (`app.getPath('userData')/ai-dev-team.db`), не
  привязана к конкретному выбранному проекту. Per-project `.ai-dev-team/`
  появится вместе с `ProjectScanner` в Phase 2.
- `WorkflowEngine.startStub()` не делает ничего, кроме записи события в
  Activity Log — это осознанная заглушка, не полноценная стейт-машина.
- `conversation:add` в Phase 1 вызывается вручную из UI (кнопка "Add" в
  Conversation panel) исключительно для проверки персистентности — реальные
  сообщения от GPT/Claude появятся вместе с адаптерами в Phase 7-8.
- В этой среде проверки (без графического дисплея) фактический запуск
  Electron GUI не проверялся визуально — проверены типизация, сборка и
  сквозная персистентность слоя хранения через прямой вызов
  TaskManager/ConversationManager/ActivityRepository с имитацией
  перезапуска (закрытие и повторное открытие БД). Рекомендуется запустить
  `npm run build && npm start` локально и подтвердить пункт 1-3 критериев
  готовности визуально.
