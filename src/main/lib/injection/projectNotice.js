"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectNoticeOverlay = void 0;

const styles_js_1 = require("./styles.js");

const DUPLICATE_NOTICE_TEXT = [
  "Обновления проекта",
  "Открыть репозиторий",
  "Остаться здесь",
  "Launcher",
];

const ensureStyles = (document) => {
  let styleNode = document.getElementById(styles_js_1.INJECTED_MOD_STYLE_ID);
  if (!styleNode) {
    styleNode = document.createElement("style");
    styleNode.id = styles_js_1.INJECTED_MOD_STYLE_ID;
    styleNode.textContent = styles_js_1.injectedModStyles;
    document.head.appendChild(styleNode);
  }
};

const createElement = (document, tagName, className, textContent = "") => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

const createProjectNoticeOverlay = ({ windowObject, document, bridge }) => {
  let rootNode = null;
  let removeShowListener = null;
  let removeStoreListener = null;
  let pendingTimer = null;

  const shouldShowNotice = () =>
    bridge.getProjectNoticeSeenVersion?.() !== bridge.getProjectNoticeVersion?.();

  const findExistingChunkNotice = () =>
    Array.from(document.querySelectorAll("button, a, h1, h2, h3, p, span, div"))
      .some((node) => {
        if (node.closest(".modProjectNotice")) return false;
        const text = node.textContent?.trim();
        if (!text) return false;
        return DUPLICATE_NOTICE_TEXT.some((needle) => text.includes(needle));
      });

  const ensureRoot = () => {
    if (rootNode) return rootNode;

    rootNode = createElement(document, "div", "modProjectNotice");
    rootNode.dataset.open = "false";

    const backdrop = createElement(document, "button", "modProjectNotice__backdrop");
    backdrop.type = "button";
    backdrop.addEventListener("click", () => {
      bridge.markProjectNoticeSeen?.();
      bridge.setProjectNoticeDecision("stay");
      hide();
    });

    const card = createElement(document, "section", "modProjectNotice__card");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", "Обновления проекта");

    const badge = createElement(document, "div", "modProjectNotice__badge", "ModYandexClient");
    const title = createElement(document, "h2", "modProjectNotice__title", "Обновления проекта");
    const copy = createElement(
      document,
      "p",
      "modProjectNotice__copy",
      "У проекта появился новый репозиторий. Обновления будут выходить регулярно и без обязательной установки дополнительного софта.",
    );
    const launcherCopy = createElement(
      document,
      "p",
      "modProjectNotice__copy modProjectNotice__copy_muted",
      "Если нужен максимально простой автоапдейт при запуске, можно поставить Launcher.",
    );

    const actions = createElement(document, "div", "modProjectNotice__actions");
    const stayButton = createElement(document, "button", "modProjectNotice__button modProjectNotice__button_secondary", "Остаться здесь");
    stayButton.type = "button";
    stayButton.addEventListener("click", () => {
      bridge.markProjectNoticeSeen?.();
      bridge.setProjectNoticeDecision("stay");
      hide();
    });

    const repoButton = createElement(document, "button", "modProjectNotice__button modProjectNotice__button_primary", "Открыть репозиторий");
    repoButton.type = "button";
    repoButton.addEventListener("click", async () => {
      bridge.markProjectNoticeSeen?.();
      bridge.setProjectNoticeDecision("migrate");
      hide();
      await bridge.openProjectRepository();
    });

    actions.appendChild(stayButton);
    actions.appendChild(repoButton);

    const links = createElement(document, "div", "modProjectNotice__links");
    const launcherLink = createElement(document, "button", "modProjectNotice__link", "Launcher");
    launcherLink.type = "button";
    launcherLink.addEventListener("click", () => bridge.openLauncherRepository());
    const projectLink = createElement(document, "button", "modProjectNotice__link", "GitHub проекта");
    projectLink.type = "button";
    projectLink.addEventListener("click", () => bridge.openProjectRepository());

    links.appendChild(launcherLink);
    links.appendChild(projectLink);

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(copy);
    card.appendChild(launcherCopy);
    card.appendChild(actions);
    card.appendChild(links);

    rootNode.appendChild(backdrop);
    rootNode.appendChild(card);
    document.body.appendChild(rootNode);
    return rootNode;
  };

  const show = () => {
    if (!shouldShowNotice()) return;
    ensureRoot().dataset.open = "true";
  };

  const hide = () => {
    if (rootNode) {
      rootNode.dataset.open = "false";
    }
  };

  const requestShow = () => {
    if (!shouldShowNotice()) return;
    if (pendingTimer) {
      windowObject.clearTimeout(pendingTimer);
    }
    pendingTimer = windowObject.setTimeout(() => {
      pendingTimer = null;
      if (!shouldShowNotice()) return;
      if (findExistingChunkNotice()) return;
      show();
    }, 320);
  };

  return {
    start() {
      ensureStyles(document);
      ensureRoot();
      removeShowListener = bridge.onShowMergeModal(() => requestShow());
      removeStoreListener = bridge.onStoreUpdate((key) => {
        if (
          (key === "projectNoticeDecisionV2" && bridge.getProjectNoticeDecision()) ||
          (key === "projectNoticeSeenVersion" && !shouldShowNotice())
        ) {
          hide();
        }
      });
      requestShow();
    },
    show,
    hide,
    destroy() {
      if (pendingTimer) {
        windowObject.clearTimeout(pendingTimer);
        pendingTimer = null;
      }
      removeShowListener?.();
      removeStoreListener?.();
      removeShowListener = null;
      removeStoreListener = null;
      rootNode?.remove();
      rootNode = null;
    },
  };
};
exports.createProjectNoticeOverlay = createProjectNoticeOverlay;
