# AGENTS

Этот файл нужен как короткая памятка для будущих агентных сессий в этом репозитории.

## Кратко о проекте

- Это основной репозиторий продолжения развития мода для десктопного клиента Яндекс Музыки.
- Основной workflow завязан не на `npm scripts`, а на `node toolset.js ...`.
- `src/` — главный источник для сборки релизного `app.asar`.
- `extracted/` — рабочая зона для анализа новых upstream-версий.
- `miniplayer/` и `native/` собираются автоматически из `toolset.js`.

## Где что лежит

- `toolset.js` — extract/build/spoof/release/direct-build.
- `src/package.json` — главный файл версий и runtime-конфига.
- `PATCHNOTES.md` — текст ближайшего релиза.
- `src/main/lib/modUpdater.js` — апдейтер мода через GitHub latest release.
- `src/main/index.js` — инициализация FFmpeg updater и main runtime.
- `src/main/lib/ffmpegInstaller.js` — установка FFmpeg из release tag `ffmpeg-binaries`.
- `miniplayer/` — исходники миниплеера, артефакты уходят в `src/main/lib/miniplayer/renderer/`.
- `native/setIconicThumbnail/` — Windows-only native addon.

## Какие версии важны

- `src/package.json.version` — spoofed версия клиента Яндекс Музыки.
- `src/package.json.buildInfo.VERSION` — должна совпадать с `version`.
- `src/package.json.modification.version` — настоящая версия мода; именно она становится `release.name`.

## Основные команды

```powershell
npm install
node toolset.js help
node toolset.js extract
node toolset.js extract -p
node toolset.js spoof
node toolset.js build
node toolset.js build -m
node toolset.js build -d -m
node toolset.js release
```

## Рекомендуемый рабочий процесс

### Если задача про функциональность мода

- Редактировать `src/`, а не `extracted/`.
- Собирать через `node toolset.js build`.
- Для локальной проверки в установленном клиенте использовать `node toolset.js build -d -m`.

### Если задача про поддержку новой версии Яндекс Музыки

- Обновить официальный клиент.
- Запустить `node toolset.js extract`.
- При необходимости прогнать `onUpdate.bat`.
- После extraction запустить `node toolset.js spoof`.
- Перенести нужные изменения в `src/`.

## Что нужно знать про release

- Release делается через `node toolset.js release` или `node toolset.js build -r`.
- Тег создаётся как `onlyDiscordRPC@<modification.version>`.
- Release name равен `modification.version`.
- В релиз грузятся `app.asar` и `app.asar.unpacked.zip`.
- После публикации GitHub Actions добавляют `app.asar.gz`, `app.asar.zst` и DevTools-only артефакты.

## Правило по веткам и тегу релиза

- Любые релизные изменения (включая `src/package.json`, `PATCHNOTES.md`, `toolset.js`) коммитить и пушить в обе ветки: сначала `dev`, затем `master`.
- Релизный тег всегда держать в формате `onlyDiscordRPC@<modification.version>` и привязывать к актуальному release-коммиту (а не к предыдущему).

## Критичные caveats

- В проекте жёстко зашит GitHub-репозиторий `mindst0rm/ModYandexClient`.
- `toolset.js spoof -r` опасен: он может через GitHub API обновить удалённый `master` с `force: true`.
- `src/package.json` содержит `package:*` скрипты на `builder.config.cjs`, но такого файла в репозитории нет. Не считать `electron-builder` основным путём.
- `src/` уже содержит vendored `node_modules` и compiled app bundle. Не делать массовых обновлений зависимостей без крайней необходимости.
- Автотестов для всего репозитория нет; основная проверка — успешная сборка и ручной smoke test.

## Что проверять перед изменениями

- Не сломает ли правка `toolset.js build`.
- Не поломает ли изменение direct-build и bypass asar integrity.
- Не зависит ли код от хардкоженного repo/tag для release или FFmpeg.
- Нужно ли обновить `PATCHNOTES.md` и `modification.version`.

## Что делать, если нужно выпустить релиз во fork

- Перенастроить repo owner/name в `toolset.js`.
- Перенастроить `UPDATE_CHECK_URL` в `src/main/lib/modUpdater.js`.
- Перенастроить `repo` для FFmpeg updater в `src/main/index.js`.
- Проверить workflow secrets `PAT_TOKEN`.
- Не использовать `spoof -r`, пока не убедитесь, что он бьёт в правильный репозиторий.
