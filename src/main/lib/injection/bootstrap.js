"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapInjectedModLayer = void 0;

const bridge_js_1 = require("./bridge.js");
const modShell_js_1 = require("./modShell.js");
const projectNotice_js_1 = require("./projectNotice.js");

let injectedLayer = null;

const bootstrapInjectedModLayer = (windowObject = window) => {
  if (injectedLayer) return injectedLayer;

  const bridge = (0, bridge_js_1.createModBridge)(windowObject);
  const shell = (0, modShell_js_1.createInjectedModShell)({
    windowObject,
    document: windowObject.document,
    bridge,
  });
  const projectNotice = (0, projectNotice_js_1.createProjectNoticeOverlay)({
    windowObject,
    document: windowObject.document,
    bridge,
  });

  shell.start();
  projectNotice.start();

  injectedLayer = {
    bridge,
    shell,
    projectNotice,
    openShell: () => shell.open(),
    toggleShell: () => shell.toggle(),
    destroy() {
      projectNotice.destroy();
      shell.destroy();
      bridge.destroy();
      if (windowObject.__modInjection === injectedLayer) {
        delete windowObject.__modInjection;
      }
      injectedLayer = null;
    },
  };

  windowObject.__modInjection = injectedLayer;
  return injectedLayer;
};
exports.bootstrapInjectedModLayer = bootstrapInjectedModLayer;
