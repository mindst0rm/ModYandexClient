# ModYandexClient

> [!NOTE]
> Это основной репозиторий продолжения разработки ModYandexClient. Обновления для мод-клиента выпускаются здесь регулярно, без обязательной установки дополнительного софта.
> Если нужен полностью автоматический сценарий обновления при запуске, можно использовать [yamusic-launcher](https://github.com/mindst0rm/yamusic-launcher).

## Зачем нужен этот README

Этот файл описывает проект как репозиторий разработчика, а не как страницу для конечного пользователя. Цель: чтобы по одному `README.md` можно было понять:

- что здесь является исходником;
- как устроена локальная разработка;
- как обновляться под новую версию Яндекс Музыки;
- как собирать `app.asar`;
- как делать bump версий;
- как выкатывать GitHub release;
- где в проекте зашиты опасные или нетривиальные допущения.

## Что это за проект

`ModYandexClient` это модификация десктопного клиента Яндекс Музыки. Репозиторий не похож на обычный Electron-проект с чистыми исходниками: здесь в `src/` лежит уже подготовленный снапшот приложения Яндекс Музыки с модификациями, а поверх него есть набор инструментов для:

- извлечения свежего `app.asar` из установленного клиента;
- патчинга extracted-сборки;
- пересборки `app.asar`;
- прямой подмены `app.asar` в установленном приложении;
- публикации мод-обновления как GitHub release;
- анализа изменений между версиями Яндекс Музыки.

Главный рабочий entrypoint для сборки и релиза: `node toolset.js ...`

`electron-builder` здесь не является основным поддерживаемым путём. В `src/package.json` есть `package:*` скрипты, но они ссылаются на отсутствующий `builder.config.cjs`, поэтому реальный рабочий сценарий в этом репозитории идёт через [`toolset.js`](./toolset.js).

## Карта репозитория

### Ключевые директории

- `src/` — основной снапшот модифицированного клиента. Это главный источник для сборки `app.asar`.
- `src/app/` — фронтенд-бандл Яндекс Музыки.
- `src/main/` — main process, модификации, апдейтеры, FFmpeg, Discord RPC и т. д.
- `miniplayer/` — отдельный React/Vite-проект миниплеера. Результат сборки попадает в `src/main/lib/miniplayer/renderer/`.
- `native/` — исходники нативных модулей. Сейчас основной модуль: `setIconicThumbnail`.
- `dataminer/` — утилиты для анализа extracted-версий и расчёта diff между обновлениями Яндекс Музыки.
- `.github/workflows/` — автоматизация вокруг FFmpeg и post-release ассетов.
- `PATCHNOTES.md` — текст релиз-нотов для ближайшего релиза мода.
- `toolset.js` — вся оркестрация extract/build/spoof/release.

### Генерируемые директории

- `builds/latest/` — обычная локальная сборка `app.asar`.
- `builds/patched/` — patched/devtools-сборки.
- `extracted/` — распакованные версии оригинального клиента.
- `minified/` — временная директория при сборке с минификацией.
- `temp/` — временные файлы, хэши, загрузки и служебные артефакты.
- `src/main/native_modules/` — результаты сборки нативных модулей.
- `src/main/lib/miniplayer/renderer/` — артефакты сборки миниплеера.

## Как здесь устроен source of truth

У проекта есть три разных уровня "истины":

1. Установленный официальный клиент Яндекс Музыки.
   Из него извлекается актуальный upstream `app.asar`.

2. `extracted/<версия>` и `extracted/<версия>@pure`.
   Это рабочая зона для анализа обновлений. `@pure` хранит чистую распаковку, без патчей; каталог без суффикса может быть пропатчен.

3. `src/`.
   Это итоговый поддерживаемый снапшот мода, из которого делается релизный `app.asar`.

Если задача не про разбор нового апдейта Яндекс Музыки, почти всегда нужно редактировать именно `src/`, а не `extracted/`.

## Версии: что именно bump-ать

Главная ловушка репозитория — здесь есть несколько разных версий, и они отвечают за разное.

### `src/package.json -> version`

Это версия самого клиента Яндекс Музыки, под которую замаскирован мод. По истории коммитов именно это поле меняется в коммитах вида:

- `chore: Spoof version from 5.84.1 to 5.85.0`

Обычно это поле синхронизируется с extracted-версией через `toolset.js spoof`.

### `src/package.json -> buildInfo.VERSION`

Это дублирование версии клиента Яндекс Музыки. После spoof-а это поле тоже должно совпадать с `version`.

### `src/package.json -> modification.version`

Это настоящая версия мода. Именно она:

- показывается мод-апдейтеру;
- используется как `release.name` на GitHub;
- становится частью релизного тега `onlyDiscordRPC@<modVersion>`.

Когда вы делаете новый релиз мода, bump-ать нужно в первую очередь это поле.

### `PATCHNOTES.md`

Это релиз-ноты следующего релиза мода. Коммиты `chore: Prepare to release` в истории почти всегда меняют:

- `PATCHNOTES.md`
- `src/package.json -> modification.version`

## Требования к окружению

### Базовые

- Node.js для запуска `toolset.js` и вспомогательных скриптов.
- `npm install` в корне репозитория.
- установленный десктопный клиент Яндекс Музыки.

### Для Windows

- Visual Studio Build Tools / C++ toolchain для `node-gyp`, если нужна пересборка нативного модуля;
- 7-Zip для ручной распаковки инсталляторов и для GitHub Actions-воркфлоу `buildDevToolsOnly`.

### Для macOS

- для прямой замены `app.asar` через `build -d` нужен отключённый SIP для файловой системы, потому что `toolset.js` переписывает `Info.plist` и переподписывает приложение.

## Установка зависимостей

### 1. Корневые зависимости

```powershell
npm install
```

Это ставит зависимости только для инструментария репозитория. В корневом `package.json` нет `scripts`; запуск идёт напрямую через `node toolset.js`.

### 2. Зависимости миниплеера

Обычно вручную не нужны. При сборке `toolset.js` сам запускает:

```powershell
cd miniplayer
npm install
npm run build
```

### 3. Зависимости нативного модуля

Тоже обычно руками не нужны. При сборке `toolset.js` сам заходит в `native/<module>` и запускает `npm run build`.

## Быстрые команды

### Официальные bat-обёртки

- `build.bat` -> `node toolset.js build`
- `buildAndRelease.bat` -> `node toolset.js build -r`
- `buildDirectly.bat` -> `node toolset.js build -d -m`
- `buildDirectlyNoMinify.bat` -> `node toolset.js build -d`
- `onUpdate.bat` -> extract/patch/direct-build + dataminer + diffCalculator

### Основные команды `toolset.js`

```powershell
node toolset.js help
node toolset.js extract
node toolset.js extract -p
node toolset.js build
node toolset.js build -m
node toolset.js build -d -m
node toolset.js spoof
node toolset.js release
```

### Что делают ключевые флаги

- `-m` — включает минификацию.
- `-d` — собирает напрямую в установленный клиент.
- `-p` — патчит extracted-сборку.
- `-r` — делает GitHub release.
- `-b` — после `spoof` ещё и собирает.
- `-f` — форсирует перезапись/переизвлечение.
- `--noNativeModules` — пропускает сборку нативных модулей.
- `--lastExtracted` — использует последнюю extracted-сборку как source.
- `--extractType=customAsar` — извлечение из произвольного `app.asar`.
- `--oldYMHashOverride=<hash>` — ручная подмена старого asar hash для Windows direct-build.

## Обычный workflow разработки

### Если вы меняете только код мода

1. Работайте в `src/`.
2. При необходимости меняйте `miniplayer/` и дайте `toolset.js` его пересобрать.
3. Соберите локальный `app.asar`:

```powershell
node toolset.js build
```

4. Если хотите сразу проверить в установленной Яндекс Музыке:

```powershell
node toolset.js build -d -m
```

### Если вышло новое обновление Яндекс Музыки

1. Обновите установленный официальный клиент.
2. Извлеките новый `app.asar`:

```powershell
node toolset.js extract
```

3. Если нужен пропатченный extracted-вариант для сравнения/локальной проверки:

```powershell
node toolset.js extract -p
```

4. Для полного legacy-пайплайна "после апдейта" есть:

```powershell
onUpdate.bat
```

Этот батник делает:

- `extract -pd`
- `dataminer/dataminer.js`
- `dataminer/diffCalculator.js diff -s`

Важно: `extract -pd` не только патчит extracted-сборку, но и сразу direct-build-ит её обратно в установленный клиент.

5. После extraction синхронизируйте версию клиента в `src/package.json`:

```powershell
node toolset.js spoof
```

6. Перенесите нужные изменения из новой extracted-версии в `src/`.

## Как работает сборка

В `toolset.js` сборка делает следующее:

1. Пересобирает миниплеер, если изменился `miniplayer/`.
2. Пересобирает нативные модули, если изменился `native/`.
3. Опционально минифицирует `src/` во временный `minified/src`.
4. Упаковывает всё в `app.asar`.
5. Оставляет рядом `app.asar.unpacked` для модулей `sharp` и `@img`.

Именно поэтому релиз состоит не только из `app.asar`, но и из `app.asar.unpacked.zip`.

## Direct build и замена `app.asar` в установленном клиенте

Команда:

```powershell
node toolset.js build -d -m
```

делает следующее:

1. Находит установленный клиент:
   Windows: `%LOCALAPPDATA%\Programs\YandexMusic\resources\app.asar`
   macOS: `/Applications/Яндекс Музыка.app/Contents/Resources/app.asar`

2. Закрывает Яндекс Музыку.
3. Собирает новый `app.asar` прямо поверх установленного.
4. Выполняет bypass asar integrity.
5. При необходимости открывает приложение обратно.

### Важные caveats

- На Windows bypass делается заменой старого SHA-256 хэша заголовка `app.asar` прямо внутри `Яндекс Музыка.exe`.
- На macOS bypass требует редактирования `Info.plist` и переподписи приложения.
- Если Windows direct-build не находит старый hash автоматически, используйте `--oldYMHashOverride=<hash>`.

## Как делать bump версии `app.asar`

Если под "bump версии основного `asar`" имеется в виду переход на новую версию клиента Яндекс Музыки, правильная последовательность такая:

1. Обновить официальный клиент Яндекс Музыки.
2. Запустить:

```powershell
node toolset.js extract
```

3. Проверить, что появилась новая папка `extracted/<ymVersion>@pure`.
4. Запустить:

```powershell
node toolset.js spoof
```

5. Убедиться, что в `src/package.json` обновились:
   - `version`
   - `buildInfo.VERSION`

6. После этого уже переносить модификации и собирать новый `app.asar`.

Если нужно выпустить новую версию мода без смены upstream-версии Яндекс Музыки, bump-айте только:

- `src/package.json -> modification.version`
- `PATCHNOTES.md`

## Как делать релиз мода

### Локальная ручная схема

1. Убедитесь, что `src/` в нужном состоянии.
2. Проверьте `src/package.json`:
   - `version` и `buildInfo.VERSION` соответствуют целевой версии Яндекс Музыки;
   - `modification.version` увеличен.
3. Обновите `PATCHNOTES.md`.
4. Соберите релизный `app.asar`:

```powershell
node toolset.js build
```

5. Создайте релиз:

```powershell
node toolset.js release
```

Или одной командой:

```powershell
node toolset.js build -r
```

### Что делает `release`

`toolset.js release`:

- берёт `modification.version` как версию релиза;
- берёт текущую upstream YM-версию из установленного клиента;
- создаёт тег `onlyDiscordRPC@<modVersion>`;
- создаёт draft release;
- загружает `app.asar`;
- загружает `app.asar.unpacked.zip`;
- публикует release;
- отправляет patch notes в Discord webhook.

### Что нужно в `.env`

Смотрите `.env.example`:

```dotenv
GITHUB_TOKEN=
DISCORD_WEBHOOK_URL=
DISCORD_DATAMINER_WEBHOOK_URL=
```

Минимально для локального релиза нужны:

- `GITHUB_TOKEN`
- `DISCORD_WEBHOOK_URL`

### Важно про GitHub токен

`toolset.js` использует `Octokit` и ждёт, что токен сможет:

- создавать теги;
- создавать release;
- загружать release assets.

На GitHub Actions дополнительно используется отдельный секрет `PAT_TOKEN` в workflow-файлах.

## Как устроен post-release pipeline на GitHub

После публикации релиза срабатывают дополнительные workflow:

### `compressAsset.yml`

После `release.published` он:

- скачивает `app.asar` из latest release;
- создаёт `app.asar.gz`;
- создаёт `app.asar.zst`;
- дозаливает их в тот же релиз.

Это важно, потому что мод-апдейтер в рантайме предпочитает сначала `app.asar.zst`, потом `app.asar.gz`, и только потом обычный `app.asar`.

### `buildDevToolsOnly.yml`

После `release.published` он:

- скачивает последний официальный Windows installer Яндекс Музыки;
- извлекает оттуда `app.asar`;
- патчит только devtools/devpanel сценарий;
- публикует `appDevTools.asar` и `appDevTools.asar.gz`.

Это отдельный облегчённый релизный канал для пользователей, которым нужны только DevTools.

### `ffmpeg.yml`

Это ручной workflow для публикации FFmpeg-бинарников под тегом `ffmpeg-binaries`.

Он нужен потому, что рантайм-код скачивает FFmpeg из GitHub release, а не из самого репозитория:

- репозиторий задаётся в `src/main/index.js`;
- бинарники сверяются по `.sha256`.

## Как работают обновления в рантайме

У проекта два независимых канала обновления:

### 1. Официальные обновления Яндекс Музыки

Они идут через `electron-updater` и конфиг из `src/package.json -> common.UPDATE_URL`.

### 2. Обновления самого мода

Они идут через GitHub latest release:

- `src/main/lib/modUpdater.js` проверяет `https://api.github.com/repos/mindst0rm/ModYandexClient/releases/latest`
- в качестве версии сравнивается `src/package.json -> modification.version`
- ассеты выбираются в приоритете:
  - `app.asar.zst`
  - `app.asar.gz`
  - `app.asar`

Установка мода делается через внешний патчер по протоколу `ymmp://patch/from-mod/...`

## Очень важные legacy-ограничения

### Репозиторий релизов зашит жёстко

Несколько мест в проекте жёстко завязаны на конкретный GitHub-репозиторий, и сейчас это `mindst0rm/ModYandexClient`:

- `toolset.js`
- `src/main/lib/modUpdater.js`
- `src/main/index.js`
- `src/main/lib/discordRichPresence.js`
- GitHub Actions, использующие release assets

Если вы работаете во fork-репозитории и хотите выпускать релизы именно туда, эти места нужно переопределить вручную.

### `spoof -r` опаснее, чем кажется

Команда `node toolset.js spoof -r` не просто меняет локальный `src/package.json`. Она может:

- смотреть latest release в захардкоженном GitHub repo;
- автоматически увеличить `modification.version`;
- создать коммит через GitHub API;
- форсированно обновить `heads/master` в удалённом репозитории.

Это legacy-автоматизация под конкретный репозиторий. На другом форке использовать её без адаптации нельзя.

### `src/` это не "чистый исходник"

- здесь много уже собранного кода;
- `src/node_modules` закоммичены;
- редактирование часто происходит прямо в compiled JS/HTML;
- `npm install` внутри `src/` не является стандартной частью workflow и может породить лишний шум в diff.

## Рекомендуемый релизный чеклист

1. Проверить `git diff`.
2. Проверить `src/package.json`.
3. Проверить `PATCHNOTES.md`.
4. При обновлении upstream-версии сделать `extract` и `spoof`.
5. Собрать `node toolset.js build`.
6. По возможности проверить direct-build локально.
7. Убедиться, что рядом с `builds/latest/app.asar` есть `app.asar.unpacked`.
8. Сделать `node toolset.js release`.
9. Проверить опубликованный GitHub release и появление:
   - `app.asar`
   - `app.asar.unpacked.zip`
   - позднее `app.asar.gz`
   - позднее `app.asar.zst`
   - позднее `appDevTools.asar`

## Что можно считать нормой по истории коммитов

Судя по git-истории, у проекта были устойчивые паттерны:

- обычные изменения: `feat: ...`, `fix: ...`
- подготовка релиза: `chore: Prepare to release`
- синхронизация под новую Яндекс Музыку: `chore: Spoof version from X to Y`

Если хочется придерживаться сложившегося стиля, для release-подготовки лучше использовать эти же формулировки.

## Что проверять перед крупными правками

- не поломается ли `build -d` на текущей платформе;
- не поменялся ли формат extracted `index.js`, который патчит `patchExtractedBuild`;
- не требует ли новая версия клиента переноса regex-патчей devpanel;
- не сломался ли update flow из-за новых имён release assets;
- не нужно ли перезапустить `ffmpeg.yml` при изменениях вокруг FFmpeg.

## Чего здесь сейчас нет

- полноценного CI для сборки основного релизного `app.asar`;
- нормального test-suite для всего репозитория;
- актуального `builder.config.cjs`;
- отделённых "исходников" Яндекс Музыки до стадии compiled bundle.

Практически вся валидация здесь — это сборка, ручной smoke test и проверка release assets.
