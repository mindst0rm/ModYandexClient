"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createModBridge = void 0;

const electron_1 = require("electron");
const config_js_1 = require("../../config.js");
const store_js_1 = require("../store.js");
const events_js_1 = require("../../types/events.js");

const PROJECT_REPOSITORY_URL = "https://github.com/mindst0rm/ModYandexClient";
const LAUNCHER_REPOSITORY_URL = "https://github.com/mindst0rm/yamusic-launcher";
const PROJECT_NOTICE_DECISION_KEY = "projectNoticeDecisionV2";
const PROJECT_NOTICE_SEEN_VERSION_KEY = "projectNoticeSeenVersion";
const PROJECT_NOTICE_VERSION = "repo-update-2026-04-01";
const SETTING_ALIASES = {
  "modFeatures.appAutoUpdates.enableAppAutoUpdate": {
    mirrorKey: "modSettings.appAutoUpdates.enableAppAutoUpdate",
  },
  "modFeatures.appAutoUpdates.enableAppAutoUpdateByProbability": {
    mirrorKey: "modSettings.appAutoUpdates.enableAppAutoUpdateByProbability",
  },
  "modFeatures.playerBarEnhancement.showCodecInsteadOfQualityMark": {
    mirrorKey: "modSettings.playerBarEnhancement.showCodecInsteadOfQualityMark",
  },
  "modFeatures.playerBarEnhancement.showDislikeButton": {
    mirrorKey: "modSettings.playerBarEnhancement.changeDislikeButtonPos",
  },
  "modFeatures.playerBarEnhancement.showRepeatButtonOnVibe": {
    mirrorKey: "modSettings.playerBarEnhancement.showRepeatButtonOnVibe",
  },
  "modFeatures.playerBarEnhancement.alwaysShowPlayerTimestamps": {
    mirrorKey: "modSettings.playerBarEnhancement.alwaysShowTimestamps",
  },
  "modFeatures.playerBarEnhancement.disablePerTrackColors": {
    mirrorKey: "modSettings.playerBarEnhancement.disablePerTrackColors",
  },
  "modFeatures.playerBarEnhancement.alwaysWideBar": {
    mirrorKey: "modSettings.playerBarEnhancement.alwaysWideBar",
  },
  "modFeatures.playerBarEnhancement.whitePlayButton": {
    mirrorKey: "modSettings.playerBarEnhancement.playButtonType",
    transformWrite: (value) => (value ? "white" : "yellow"),
  },
  "modFeatures.vibeAnimationEnhancement.disableRendering": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.disableRendering",
  },
  "modFeatures.vibeAnimationEnhancement.autoLaunchOnAppStartup": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.autoLaunchOnAppStartup",
  },
  "modFeatures.vibeAnimationEnhancement.enableEndlessMusic": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.enableEndlessMusic",
  },
  "modFeatures.vibeAnimationEnhancement.playOnAnyEntity": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.playVibeOnAnyEntity",
  },
  "modFeatures.vibeAnimationEnhancement.useDynamicEnergy": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.useDynamicEnergy",
  },
  "modFeatures.vibeAnimationEnhancement.smoothDynamicEnergy": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.smoothDynamicEnergy",
  },
  "modFeatures.vibeAnimationEnhancement.maxFPS": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.maxFPS",
  },
  "modFeatures.vibeAnimationEnhancement.intensityCoefficient": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.vibeIntensityCoefficient",
  },
  "modFeatures.vibeAnimationEnhancement.smoothDynamicEnergyCoefficient": {
    mirrorKey: "modSettings.vibeAnimationEnhancement.smoothDynamicEnergyCoefficient",
  },
  "modFeatures.windowBehavior.preventDisplaySleep": {
    mirrorKey: "modSettings.window.preventDisplaySleep",
  },
  "modFeatures.windowBehavior.autoLaunchOnSystemStartup": {
    mirrorKey: "modSettings.window.autoStartup",
  },
  "modFeatures.windowBehavior.startMinimized": {
    mirrorKey: "modSettings.window.minimizedStart",
  },
  "modFeatures.windowBehavior.minimizeToTrayOnWindowClose": {
    mirrorKey: "modSettings.window.toTray",
  },
  "modFeatures.windowBehavior.saveWindowDimensionsOnRestart": {
    mirrorKey: "modSettings.window.saveWindowDimensionsOnRestart",
  },
  "modFeatures.windowBehavior.saveWindowPositionOnRestart": {
    mirrorKey: "modSettings.window.saveWindowPositionOnRestart",
  },
  "modFeatures.windowBehavior.startupPage": {
    mirrorKey: "modSettings.window.startupPage",
  },
  "modFeatures.taskBarExtensions.enable": {
    mirrorKey: "modSettings.taskBarExtensions.enable",
  },
  "modFeatures.taskBarExtensions.coverAsThumbnail": {
    mirrorKey: "modSettings.taskBarExtensions.coverAsThumbnail",
  },
  "modFeatures.miniplayer.skipTaskbar": {
    mirrorKey: "modSettings.miniplayer.skipTaskbar",
  },
  "modFeatures.miniplayer.savePosition": {
    mirrorKey: "modSettings.miniplayer.savePosition",
  },
  "modFeatures.miniplayer.saveDimensions": {
    mirrorKey: "modSettings.miniplayer.saveDimensions",
  },
  "modFeatures.miniplayer.alwaysShowPlayerTimestamps": {
    mirrorKey: "modSettings.miniplayer.alwaysShowPlayerTimestamps",
  },
  "modFeatures.r128Normalization": {
    mirrorKey: "modSettings.r128Normalization",
  },
  "modFeatures.tryEnableSurroundAudio": {
    mirrorKey: "modSettings.tryEnableSurroundAudio",
  },
  "modFeatures.scrobblers.lastfm.enable": {
    mirrorKey: "modSettings.scrobblers.lastfm.enable",
  },
  "modFeatures.scrobblers.lastfm.fromYnison": {
    mirrorKey: "modSettings.scrobblers.lastfm.fromYnison",
  },
  "modFeatures.scrobblers.lastfm.autoLike": {
    mirrorKey: "modSettings.scrobblers.lastfm.autoLike",
  },
  "modFeatures.scrobblers.lastfm.separatorType": {
    mirrorKey: "modSettings.scrobblers.lastfm.separatorType",
  },
  "modFeatures.downloader.useDefaultPath": {
    mirrorKey: "modSettings.downloader.useDefaultPath",
  },
  "modFeatures.downloader.defaultPath": {
    mirrorKey: "modSettings.downloader.defaultPath",
  },
  "modFeatures.downloader.useMP3": {
    mirrorKey: "modSettings.downloader.useMP3",
  },
  "modFeatures.downloader.useSyncLyrics": {
    mirrorKey: "modSettings.downloader.useSyncLyrics",
  },
  "modFeatures.downloader.useCustomPathForSessionStorage": {
    mirrorKey: "modSettings.downloader.useCustomPathForSessionStorage",
  },
  "modFeatures.downloader.customPathForSessionStorage": {
    mirrorKey: "modSettings.downloader.customPathForSessionStorage",
  },
};

const sendSettingUpdate = (key, value) => {
  electron_1.ipcRenderer.send(events_js_1.Events.NATIVE_STORE_SET, key, value);
};

const createModBridge = (windowObject = window) => {
  const storeListeners = new Set();

  const handleStoreUpdate = (_event, key, value) => {
    storeListeners.forEach((listener) => {
      try {
        listener(key, value);
      } catch (error) {
        console.error("[modBridge] store listener failed", error);
      }
    });
  };

  electron_1.ipcRenderer.on(events_js_1.Events.NATIVE_STORE_UPDATE, handleStoreUpdate);

  const onDesktopEvent = (eventName, listener) => {
    const wrappedListener = (...args) => listener(...args);
    electron_1.ipcRenderer.on(eventName, wrappedListener);
    return () => electron_1.ipcRenderer.off(eventName, wrappedListener);
  };

  const getSetting = (key, fallbackValue = undefined) => {
    const value = (0, store_js_1.get)(key);
    return value === undefined ? fallbackValue : value;
  };

  return {
    urls: {
      project: PROJECT_REPOSITORY_URL,
      launcher: LAUNCHER_REPOSITORY_URL,
    },
    getRuntimeInfo() {
      return {
        modVersion: String(config_js_1.config.modification.version ?? "unknown"),
        hostVersion: String(
          config_js_1.config.modification.realYMVersion ??
            config_js_1.config.buildInfo.VERSION ??
            "unknown",
        ),
        platform: windowObject.PLATFORM ?? "desktop",
      };
    },
    getSetting,
    setSetting(key, value) {
      sendSettingUpdate(key, value);
      const alias = SETTING_ALIASES[key];
      if (alias?.mirrorKey) {
        const mirrorValue =
          typeof alias.transformWrite === "function" ? alias.transformWrite(value) : value;
        sendSettingUpdate(alias.mirrorKey, mirrorValue);
      }
    },
    onStoreUpdate(listener) {
      storeListeners.add(listener);
      return () => storeListeners.delete(listener);
    },
    on(eventName, listener) {
      return onDesktopEvent(eventName, listener);
    },
    onShowMergeModal(listener) {
      return onDesktopEvent(events_js_1.Events.SHOW_MERGE_MODAL, listener);
    },
    getProjectMergeDecision() {
      return getSetting("projectMergeDecision", null);
    },
    setProjectMergeDecision(decision) {
      electron_1.ipcRenderer.send(events_js_1.Events.PROJECT_MERGE_DECISION, decision);
    },
    getProjectNoticeDecision() {
      return getSetting(PROJECT_NOTICE_DECISION_KEY, null);
    },
    setProjectNoticeDecision(decision) {
      sendSettingUpdate(PROJECT_NOTICE_DECISION_KEY, decision);
    },
    getProjectNoticeVersion() {
      return PROJECT_NOTICE_VERSION;
    },
    getProjectNoticeSeenVersion() {
      return getSetting(PROJECT_NOTICE_SEEN_VERSION_KEY, null);
    },
    markProjectNoticeSeen() {
      sendSettingUpdate(PROJECT_NOTICE_SEEN_VERSION_KEY, PROJECT_NOTICE_VERSION);
    },
    restartApp() {
      electron_1.ipcRenderer.send(events_js_1.Events.APPLICATION_RESTART);
    },
    openConfigFile() {
      return electron_1.ipcRenderer.invoke("openConfigFile");
    },
    setPathWithNativeDialog(key, defaultPath, properties) {
      return electron_1.ipcRenderer.invoke(
        "setPathWithNativeDialog",
        key,
        defaultPath,
        properties,
      );
    },
    scrobbleLogin() {
      return electron_1.ipcRenderer.invoke("scrobble-login");
    },
    scrobbleLogout() {
      return electron_1.ipcRenderer.invoke("scrobble-logout");
    },
    openExternal(url) {
      return electron_1.shell.openExternal(url);
    },
    openProjectRepository() {
      return electron_1.shell.openExternal(PROJECT_REPOSITORY_URL);
    },
    openLauncherRepository() {
      return electron_1.shell.openExternal(LAUNCHER_REPOSITORY_URL);
    },
    applyInterfaceSettings() {
      return windowObject.applyModInterfaceSettings?.();
    },
    destroy() {
      electron_1.ipcRenderer.off(events_js_1.Events.NATIVE_STORE_UPDATE, handleStoreUpdate);
      storeListeners.clear();
    },
  };
};
exports.createModBridge = createModBridge;
