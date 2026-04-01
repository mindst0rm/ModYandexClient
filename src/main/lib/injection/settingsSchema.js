"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createModSettingsSections = void 0;

const readHiddenMenuItems = (bridge) => {
  const value = bridge.getSetting("modFeatures.interfaceTheme.hiddenMenuItems", []);
  return Array.isArray(value) ? value : [];
};

const writeHiddenMenuItems = (bridge, nextItems) => {
  bridge.setSetting("modFeatures.interfaceTheme.hiddenMenuItems", nextItems);
  bridge.applyInterfaceSettings();
};

const createMenuVisibilityField = (value, title) => ({
  type: "toggle",
  key: "modFeatures.interfaceTheme.hiddenMenuItems",
  title,
  description: "Убирает пункт из левого бокового меню.",
  read: (bridge) => readHiddenMenuItems(bridge).includes(value),
  write: (bridge, enabled) => {
    const current = readHiddenMenuItems(bridge);
    const next = enabled ? Array.from(new Set([...current, value])) : current.filter((item) => item !== value);
    writeHiddenMenuItems(bridge, next);
  },
});

const createModSettingsSections = (bridge) => [
  {
    id: "runtime",
    title: "Система и релизы",
    description: "Базовые действия и настройки поведения мода.",
    fields: [
      {
        type: "toggle",
        key: "modFeatures.appAutoUpdates.enableModAutoUpdate",
        title: "Автообновление мода",
        description: "Проверяет и ставит обновления ModYandexClient.",
      },
      {
        type: "toggle",
        key: "modFeatures.appAutoUpdates.enableAppAutoUpdate",
        title: "Автообновление клиента",
        description: "Разрешает обновление самого клиента Яндекс Музыки.",
      },
      {
        type: "toggle",
        key: "modFeatures.appAutoUpdates.enableAppAutoUpdateByProbability",
        title: "Обновлять по probability bucket",
        description: "Следовать rollout-логике клиента вместо ручного форса.",
      },
      {
        type: "toggle",
        key: "sendAnonymizedMetrics",
        title: "Анонимная статистика",
        description: "Отправлять обезличенную статистику мода.",
      },
      {
        type: "toggle",
        key: "enableDevTools",
        title: "Режим разработчика",
        description: "Включает DevTools и dev-панель. Требует перезапуска.",
      },
      {
        type: "actions",
        title: "Быстрые действия",
        actions: [
          {
            label: "config.json",
            onClick: () => bridge.openConfigFile(),
          },
          {
            label: "GitHub",
            primary: true,
            onClick: () => bridge.openProjectRepository(),
          },
          {
            label: "Launcher",
            onClick: () => bridge.openLauncherRepository(),
          },
          {
            label: "Перезапуск",
            onClick: () => bridge.restartApp(),
          },
        ],
      },
    ],
  },
  {
    id: "interface",
    title: "Интерфейс и тема",
    description: "UI-настройки, которые уже можно держать вне patched settings chunk.",
    fields: [
      {
        type: "toggle",
        key: "modFeatures.interfaceTheme.customAccentEnabled",
        title: "Собственный accent-цвет",
        description: "Подкрашивает акцентные элементы интерфейса.",
        afterChange: () => bridge.applyInterfaceSettings(),
      },
      {
        type: "select",
        key: "modFeatures.interfaceTheme.accentColor",
        title: "Accent-цвет",
        description: "Цвет для accent-режима.",
        options: [
          { label: "Yandex Yellow", value: "#fed42b" },
          { label: "Blue", value: "#4A9EFF" },
          { label: "Green", value: "#34c72c" },
          { label: "Red", value: "#e74343" },
          { label: "Purple", value: "#b74bd9" },
          { label: "Pink", value: "#f161c4" },
        ],
        afterChange: () => bridge.applyInterfaceSettings(),
      },
      {
        type: "toggle",
        key: "modFeatures.interfaceTheme.hideExplicitMark",
        title: "Скрывать explicit-метки",
        description: "Убирает 18+ / explicit-метки там, где это возможно.",
        afterChange: () => bridge.applyInterfaceSettings(),
      },
      createMenuVisibilityField("concerts", "Скрыть «Концерты»"),
      createMenuVisibilityField("non-music", "Скрыть «Подкасты и книги»"),
      createMenuVisibilityField("kids", "Скрыть «Детям»"),
    ],
  },
  {
    id: "player",
    title: "Плеер и звук",
    description: "Основные модификации панели плеера и аудио.",
    fields: [
      {
        type: "toggle",
        key: "modFeatures.playerBarEnhancement.showCodecInsteadOfQualityMark",
        title: "Кодек вместо бейджа качества",
      },
      {
        type: "toggle",
        key: "modFeatures.playerBarEnhancement.showDislikeButton",
        title: "Показывать кнопку дизлайка",
      },
      {
        type: "toggle",
        key: "modFeatures.playerBarEnhancement.showRepeatButtonOnVibe",
        title: "Repeat в Моей Волне",
      },
      {
        type: "toggle",
        key: "modFeatures.playerBarEnhancement.alwaysShowPlayerTimestamps",
        title: "Всегда показывать таймкоды",
      },
      {
        type: "toggle",
        key: "modFeatures.playerBarEnhancement.disablePerTrackColors",
        title: "Отключить per-track цвета",
      },
      {
        type: "toggle",
        key: "modFeatures.playerBarEnhancement.alwaysWideBar",
        title: "Всегда широкий player bar",
      },
      {
        type: "toggle",
        key: "modFeatures.playerBarEnhancement.whitePlayButton",
        title: "Белая кнопка Play",
      },
      {
        type: "toggle",
        key: "modFeatures.r128Normalization",
        title: "R128 normalization",
      },
      {
        type: "toggle",
        key: "modFeatures.tryEnableSurroundAudio",
        title: "Пробовать включать surround audio",
      },
    ],
  },
  {
    id: "vibe",
    title: "Моя Волна",
    description: "Параметры vibe animation и поведения автостарта.",
    fields: [
      {
        type: "toggle",
        key: "modFeatures.vibeAnimationEnhancement.disableRendering",
        title: "Отключить рендер анимации",
      },
      {
        type: "toggle",
        key: "modFeatures.vibeAnimationEnhancement.autoLaunchOnAppStartup",
        title: "Автостарт Моей Волны",
      },
      {
        type: "toggle",
        key: "modFeatures.vibeAnimationEnhancement.enableEndlessMusic",
        title: "Endless Music",
      },
      {
        type: "toggle",
        key: "modFeatures.vibeAnimationEnhancement.playOnAnyEntity",
        title: "Анимация на любых сущностях",
      },
      {
        type: "toggle",
        key: "modFeatures.vibeAnimationEnhancement.useDynamicEnergy",
        title: "Dynamic energy",
      },
      {
        type: "toggle",
        key: "modFeatures.vibeAnimationEnhancement.smoothDynamicEnergy",
        title: "Smooth dynamic energy",
      },
      {
        type: "number",
        key: "modFeatures.vibeAnimationEnhancement.maxFPS",
        title: "Max FPS",
        min: 5,
        max: 120,
        step: 1,
      },
      {
        type: "number",
        key: "modFeatures.vibeAnimationEnhancement.intensityCoefficient",
        title: "Intensity coefficient",
        min: 0.1,
        max: 4,
        step: 0.1,
      },
      {
        type: "number",
        key: "modFeatures.vibeAnimationEnhancement.smoothDynamicEnergyCoefficient",
        title: "Smooth coefficient",
        min: 0,
        max: 1,
        step: 0.05,
      },
    ],
  },
  {
    id: "window",
    title: "Окно и миниплеер",
    description: "Window behavior, taskbar и miniplayer.",
    fields: [
      {
        type: "toggle",
        key: "modFeatures.windowBehavior.preventDisplaySleep",
        title: "Не давать монитору уснуть",
      },
      {
        type: "toggle",
        key: "modFeatures.windowBehavior.autoLaunchOnSystemStartup",
        title: "Автозапуск с системой",
      },
      {
        type: "toggle",
        key: "modFeatures.windowBehavior.startMinimized",
        title: "Запускать свёрнутым",
      },
      {
        type: "toggle",
        key: "modFeatures.windowBehavior.minimizeToTrayOnWindowClose",
        title: "Сворачивать в трей при закрытии",
      },
      {
        type: "toggle",
        key: "modFeatures.windowBehavior.saveWindowDimensionsOnRestart",
        title: "Сохранять размер окна",
      },
      {
        type: "toggle",
        key: "modFeatures.windowBehavior.saveWindowPositionOnRestart",
        title: "Сохранять позицию окна",
      },
      {
        type: "text",
        key: "modFeatures.windowBehavior.startupPage",
        title: "Стартовая страница",
        placeholder: "/",
      },
      {
        type: "toggle",
        key: "modFeatures.taskBarExtensions.enable",
        title: "Taskbar extensions",
      },
      {
        type: "toggle",
        key: "modFeatures.taskBarExtensions.coverAsThumbnail",
        title: "Обложка как thumbnail",
      },
      {
        type: "toggle",
        key: "modFeatures.miniplayer.skipTaskbar",
        title: "Миниплеер без taskbar",
      },
      {
        type: "toggle",
        key: "modFeatures.miniplayer.savePosition",
        title: "Сохранять позицию миниплеера",
      },
      {
        type: "toggle",
        key: "modFeatures.miniplayer.saveDimensions",
        title: "Сохранять размер миниплеера",
      },
      {
        type: "toggle",
        key: "modFeatures.miniplayer.alwaysShowPlayerTimestamps",
        title: "Таймкоды в миниплеере",
      },
    ],
  },
  {
    id: "integrations",
    title: "Интеграции",
    description: "Discord RPC, Ynison и Last.fm.",
    fields: [
      {
        type: "toggle",
        key: "modFeatures.discordRPC.enable",
        title: "Discord RPC",
      },
      {
        type: "toggle",
        key: "modFeatures.discordRPC.fromYnison",
        title: "RPC через Ynison",
      },
      {
        type: "toggle",
        key: "modFeatures.discordRPC.showButtons",
        title: "Кнопки в RPC",
      },
      {
        type: "toggle",
        key: "modFeatures.discordRPC.showAlbum",
        title: "Показывать альбом",
      },
      {
        type: "toggle",
        key: "modFeatures.discordRPC.showVersion",
        title: "Показывать версию",
      },
      {
        type: "toggle",
        key: "modFeatures.discordRPC.showGitHubButton",
        title: "Кнопка GitHub",
      },
      {
        type: "toggle",
        key: "modFeatures.discordRPC.showSmallIcon",
        title: "Маленькая иконка",
      },
      {
        type: "toggle",
        key: "modFeatures.discordRPC.overrideDeepLinksExperiment",
        title: "Override deeplinks experiment",
      },
      {
        type: "text",
        key: "modFeatures.discordRPC.applicationIDForRPC",
        title: "Discord application ID",
      },
      {
        type: "number",
        key: "modFeatures.discordRPC.afkTimeout",
        title: "AFK timeout (мин)",
        min: 1,
        max: 60,
        step: 1,
      },
      {
        type: "number",
        key: "modFeatures.discordRPC.reconnectInterval",
        title: "Reconnect interval (сек)",
        min: 0,
        max: 300,
        step: 5,
      },
      {
        type: "select",
        key: "modFeatures.discordRPC.statusDisplayType",
        title: "Status display type",
        options: [
          { label: "Стандартный", value: 0 },
          { label: "Сокращённый", value: 1 },
          { label: "Минимальный", value: 2 },
        ],
      },
      {
        type: "toggle",
        key: "enableYnisonRemoteControl",
        title: "Ynison Remote Control",
      },
      {
        type: "toggle",
        key: "ynisonInterceptPlayback",
        title: "Ynison intercept playback",
      },
      {
        type: "toggle",
        key: "modFeatures.scrobblers.lastfm.enable",
        title: "Last.fm scrobbling",
      },
      {
        type: "toggle",
        key: "modFeatures.scrobblers.lastfm.fromYnison",
        title: "Last.fm через Ynison",
      },
      {
        type: "toggle",
        key: "modFeatures.scrobblers.lastfm.autoLike",
        title: "Auto-like при scrobble",
      },
      {
        type: "select",
        key: "modFeatures.scrobblers.lastfm.separatorType",
        title: "Разделитель артистов",
        options: [
          { label: "Запятая", value: 0 },
          { label: "Амперсанд", value: 1 },
          { label: "Слэш", value: 2 },
        ],
      },
      {
        type: "actions",
        title: "Last.fm аккаунт",
        actions: [
          {
            label: "Войти",
            primary: true,
            onClick: () => bridge.scrobbleLogin(),
          },
          {
            label: "Выйти",
            onClick: () => bridge.scrobbleLogout(),
          },
        ],
      },
    ],
  },
  {
    id: "downloads",
    title: "Загрузки",
    description: "Downloader, FFmpeg-related workflow и директории.",
    fields: [
      {
        type: "toggle",
        key: "modFeatures.downloader.useDefaultPath",
        title: "Своя папка для загрузок",
      },
      {
        type: "path",
        key: "modFeatures.downloader.defaultPath",
        title: "Папка загрузок",
        dialogProperties: ["openDirectory", "createDirectory"],
      },
      {
        type: "toggle",
        key: "modFeatures.downloader.useMP3",
        title: "Сохранять в MP3",
      },
      {
        type: "toggle",
        key: "modFeatures.downloader.useSyncLyrics",
        title: "Сохранять sync lyrics",
      },
      {
        type: "toggle",
        key: "modFeatures.downloader.useCustomPathForSessionStorage",
        title: "Своя папка session storage",
      },
      {
        type: "path",
        key: "modFeatures.downloader.customPathForSessionStorage",
        title: "Папка session storage",
        dialogProperties: ["openDirectory", "createDirectory"],
      },
    ],
  },
];
exports.createModSettingsSections = createModSettingsSections;
