"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createInjectedModShell = void 0;

const styles_js_1 = require("./styles.js");
const settingsSchema_js_1 = require("./settingsSchema.js");

const POSITION_TARGET_SELECTORS = {
  userProfile: 'div[class*="NavbarDesktopUserWidget_userProfileContainer"]',
  navbar: 'aside[data-test-id="NAVBAR"]',
};
const MOD_LOGO_URL = "/favicon.svg";

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

const createInjectedModShell = ({ windowObject, document, bridge }) => {
  let shellRoot = null;
  let triggerRoot = null;
  let observer = null;
  let removeStoreListener = null;
  const fieldBindings = new Map();
  const settingsSections = (0, settingsSchema_js_1.createModSettingsSections)(bridge);

  const registerFieldBinding = (key, update) => {
    if (!key || typeof update !== "function") return;
    const bindings = fieldBindings.get(key) ?? [];
    bindings.push(update);
    fieldBindings.set(key, bindings);
  };

  const syncBindingsList = (bindings) => {
    bindings?.forEach((update) => update());
  };

  const syncFieldBindings = (key) => {
    for (const [bindingKey, bindings] of fieldBindings.entries()) {
      if (
        key === bindingKey ||
        key.startsWith(`${bindingKey}.`) ||
        bindingKey.startsWith(`${key}.`)
      ) {
        syncBindingsList(bindings);
      }
    }
  };

  const syncAllBindings = () => {
    for (const bindings of fieldBindings.values()) {
      syncBindingsList(bindings);
    }
  };

  const readFieldValue = (field) => {
    if (typeof field.read === "function") {
      return field.read(bridge);
    }
    return bridge.getSetting(field.key, field.defaultValue);
  };

  const writeFieldValue = (field, value) => {
    if (typeof field.write === "function") {
      field.write(bridge, value);
    } else if (field.key) {
      bridge.setSetting(field.key, value);
    }

    if (typeof field.afterChange === "function") {
      field.afterChange(value, bridge);
    }

    if (field.key) {
      syncFieldBindings(field.key);
    }
  };

  const createFieldMeta = (field) => {
    const meta = createElement(document, "div", "modShellToggle__meta");
    meta.appendChild(createElement(document, "div", "modShellToggle__title", field.title));
    if (field.description) {
      meta.appendChild(createElement(document, "div", "modShellToggle__description", field.description));
    }
    return meta;
  };

  const createToggleField = (field) => {
    const row = createElement(document, "div", "modShellToggle");
    const toggle = createElement(document, "button", "modShellSwitch");
    const thumb = createElement(document, "span", "modShellSwitch__thumb");
    toggle.type = "button";
    toggle.setAttribute("aria-label", field.title);
    toggle.appendChild(thumb);
    const sync = () => {
      const checked = Boolean(readFieldValue(field));
      toggle.dataset.checked = checked ? "true" : "false";
      toggle.setAttribute("aria-pressed", checked ? "true" : "false");
    };
    sync();
    toggle.addEventListener("click", () => {
      const currentValue = Boolean(readFieldValue(field));
      writeFieldValue(field, !currentValue);
    });
    registerFieldBinding(field.key, sync);
    row.appendChild(createFieldMeta(field));
    row.appendChild(toggle);
    return row;
  };

  const createSelectField = (field) => {
    const row = createElement(document, "label", "modShellToggle");
    const select = createElement(document, "select", "modShellSelect");
    field.options.forEach((option) => {
      const optionNode = createElement(document, "option");
      optionNode.value = String(option.value);
      optionNode.textContent = option.label;
      select.appendChild(optionNode);
    });
    const sync = () => {
      const currentValue = readFieldValue(field);
      select.value = String(currentValue ?? field.options[0]?.value ?? "");
    };
    sync();
    select.addEventListener("change", () => {
      const selectedOption = field.options.find((option) => String(option.value) === select.value);
      writeFieldValue(field, selectedOption ? selectedOption.value : select.value);
    });
    registerFieldBinding(field.key, sync);
    row.appendChild(createFieldMeta(field));
    row.appendChild(select);
    return row;
  };

  const createInputField = (field) => {
    const row = createElement(document, "label", "modShellToggle modShellToggle_column");
    const input = createElement(document, "input", "modShellInput");
    input.type = field.type === "number" ? "number" : "text";
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.type === "number") {
      if (field.min !== undefined) input.min = String(field.min);
      if (field.max !== undefined) input.max = String(field.max);
      if (field.step !== undefined) input.step = String(field.step);
    }
    const sync = () => {
      const currentValue = readFieldValue(field);
      input.value = currentValue === undefined || currentValue === null ? "" : String(currentValue);
    };
    sync();
    const commit = () => {
      let nextValue = input.value;
      if (field.type === "number") {
        if (nextValue === "") return;
        nextValue = Number(nextValue);
        if (Number.isNaN(nextValue)) return;
      }
      writeFieldValue(field, nextValue);
    };
    input.addEventListener("change", commit);
    input.addEventListener("blur", commit);
    registerFieldBinding(field.key, sync);
    row.appendChild(createFieldMeta(field));
    row.appendChild(input);
    return row;
  };

  const createPathField = (field) => {
    const row = createElement(document, "div", "modShellToggle modShellToggle_column");
    const controls = createElement(document, "div", "modShellPathField");
    const input = createElement(document, "input", "modShellInput");
    input.type = "text";
    input.readOnly = true;
    const sync = () => {
      input.value = String(readFieldValue(field) ?? "");
    };
    sync();
    const button = createElement(document, "button", "modShellAction", "Выбрать");
    button.type = "button";
    button.addEventListener("click", () => {
      bridge.setPathWithNativeDialog(field.key, readFieldValue(field), field.dialogProperties);
    });
    registerFieldBinding(field.key, sync);
    controls.appendChild(input);
    controls.appendChild(button);
    row.appendChild(createFieldMeta(field));
    row.appendChild(controls);
    return row;
  };

  const createActionsField = (field) => {
    const wrapper = createElement(document, "div", "modShellSection");
    if (field.title) {
      wrapper.appendChild(createElement(document, "div", "modShellSection__title modShellSection__title_inline", field.title));
    }
    const actions = createElement(document, "div", "modShellActions");
    field.actions.forEach((action) => {
      const button = createElement(
        document,
        "button",
        action.primary ? "modShellAction modShellAction_primary" : "modShellAction",
        action.label,
      );
      button.type = "button";
      button.addEventListener("click", () => action.onClick?.());
      actions.appendChild(button);
    });
    wrapper.appendChild(actions);
    return wrapper;
  };

  const createFieldNode = (field) => {
    switch (field.type) {
      case "toggle":
        return createToggleField(field);
      case "select":
        return createSelectField(field);
      case "number":
      case "text":
        return createInputField(field);
      case "path":
        return createPathField(field);
      case "actions":
        return createActionsField(field);
      default:
        return null;
    }
  };

  const ensureShellRoot = () => {
    if (shellRoot) return shellRoot;

    shellRoot = createElement(document, "div", "modShellRoot");
    shellRoot.dataset.open = "false";

    const backdrop = createElement(document, "button", "modShellBackdrop");
    backdrop.type = "button";
    backdrop.addEventListener("click", () => close());

    const panel = createElement(document, "div", "modShellPanel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "ModYandexClient shell");

    const header = createElement(document, "div", "modShellHeader");
    const headerMeta = createElement(document, "div", "modShellHeader__meta");
    const brand = createElement(document, "div", "modShellBrand");
    const brandLogo = createElement(document, "span", "modShellBrand__logo");
    brandLogo.style.backgroundImage = `url(${MOD_LOGO_URL})`;
    const brandCopy = createElement(document, "div", "modShellBrand__copy");
    brandCopy.appendChild(createElement(document, "div", "modShellEyebrow", "Mod shell"));
    brandCopy.appendChild(createElement(document, "div", "modShellTitle", "ModYandexClient"));
    brand.appendChild(brandLogo);
    brand.appendChild(brandCopy);
    headerMeta.appendChild(brand);
    headerMeta.appendChild(
      createElement(
        document,
        "div",
        "modShellSubtitle",
        "Панель мода поверх клиента Яндекс Музыки. Постепенно переносим сюда все mod-owned функции без правки _next/static/chunks.",
      ),
    );

    const closeButton = createElement(document, "button", "modShellClose", "×");
    closeButton.type = "button";
    closeButton.addEventListener("click", () => close());

    header.appendChild(headerMeta);
    header.appendChild(closeButton);
    panel.appendChild(header);

    const stats = createElement(document, "div", "modShellStats");
    const runtimeInfo = bridge.getRuntimeInfo();
    [
      { label: "Мод", value: runtimeInfo.modVersion },
      { label: "Хост", value: runtimeInfo.hostVersion },
      { label: "Платформа", value: runtimeInfo.platform },
    ].forEach((item) => {
      const card = createElement(document, "div", "modShellStat");
      card.appendChild(createElement(document, "div", "modShellStat__label", item.label));
      card.appendChild(createElement(document, "div", "modShellStat__value", item.value));
      stats.appendChild(card);
    });
    panel.appendChild(stats);

    const settingsContent = createElement(document, "div", "modShellSettings");
    settingsSections.forEach((section) => {
      const sectionNode = createElement(document, "details", "modShellSection modShellSection_card");
      sectionNode.open = true;
      const summary = createElement(document, "summary", "modShellSection__summary");
      const summaryMain = createElement(document, "div", "modShellSection__summaryMain");
      const summaryMeta = createElement(document, "div", "modShellSection__summaryMeta");
      summaryMeta.appendChild(createElement(document, "div", "modShellSection__title", section.title));
      if (section.description) {
        summaryMeta.appendChild(createElement(document, "div", "modShellSection__description", section.description));
      }
      summaryMain.appendChild(summaryMeta);
      summaryMain.appendChild(createElement(document, "span", "modShellSection__chevron", "⌃"));
      summary.appendChild(summaryMain);
      sectionNode.appendChild(summary);
      const fieldsNode = createElement(document, "div", "modShellToggles");
      section.fields.forEach((field) => {
        const fieldNode = createFieldNode(field);
        if (fieldNode) {
          fieldsNode.appendChild(fieldNode);
        }
      });
      sectionNode.appendChild(fieldsNode);
      settingsContent.appendChild(sectionNode);
    });
    panel.appendChild(settingsContent);

    panel.appendChild(
      createElement(
        document,
        "div",
        "modShellFooter",
        "Следующий шаг этой архитектуры — вынести сюда notice overlay, settings shell и downloader UI без правки _next/static/chunks.",
      ),
    );

    shellRoot.appendChild(backdrop);
    shellRoot.appendChild(panel);
    document.body.appendChild(shellRoot);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    return shellRoot;
  };

  const open = () => {
    ensureShellRoot().dataset.open = "true";
    syncAllBindings();
  };

  const close = () => {
    ensureShellRoot().dataset.open = "false";
  };

  const toggle = () => {
    ensureShellRoot().dataset.open === "true" ? close() : open();
  };

  const ensureTriggerRoot = () => {
    if (triggerRoot) return triggerRoot;

    triggerRoot = createElement(document, "div");
    triggerRoot.id = "mod-shell-anchor";

    const button = createElement(document, "button", "modShellTrigger");
    button.type = "button";
    button.setAttribute("aria-label", "Открыть меню мода");
    const icon = createElement(document, "span", "modShellTrigger__logo");
    icon.style.backgroundImage = `url(${MOD_LOGO_URL})`;
    const text = createElement(document, "span", "modShellTrigger__text", "Меню мода");
    button.appendChild(icon);
    button.appendChild(text);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggle();
    });

    triggerRoot.appendChild(button);
    return triggerRoot;
  };

  const resolveTriggerLayout = () => {
    const userProfileNode = document.querySelector(POSITION_TARGET_SELECTORS.userProfile);
    if (userProfileNode) {
      const rect = userProfileNode.getBoundingClientRect();
      const width = Math.max(160, Math.min(Math.round(rect.width || 176), 220));
      return {
        placement: "anchored",
        left: `${Math.max(12, Math.round(rect.left))}px`,
        top: `${Math.max(16, Math.round(rect.top - 56))}px`,
        width: `${width}px`,
        zIndex: "999998",
      };
    }

    const navbarNode = document.querySelector(POSITION_TARGET_SELECTORS.navbar);
    if (navbarNode) {
      const rect = navbarNode.getBoundingClientRect();
      const width = Math.max(160, Math.min(Math.round(rect.width - 24), 220));
      return {
        placement: "fallback",
        left: `${Math.max(12, Math.round(rect.left + 12))}px`,
        bottom: "108px",
        width: `${width}px`,
        zIndex: "999998",
      };
    }

    return {
      placement: "fallback",
      left: "18px",
      bottom: "108px",
      width: "176px",
      zIndex: "999998",
    };
  };

  const renderTrigger = () => {
    const nextTriggerRoot = ensureTriggerRoot();
    const layout = resolveTriggerLayout();

    nextTriggerRoot.dataset.placement = layout.placement;
    nextTriggerRoot.style.position = "fixed";
    nextTriggerRoot.style.left = layout.left;
    nextTriggerRoot.style.width = layout.width;
    nextTriggerRoot.style.zIndex = layout.zIndex;
    nextTriggerRoot.style.top = layout.top ?? "";
    nextTriggerRoot.style.bottom = layout.bottom ?? "";

    if (!nextTriggerRoot.isConnected) {
      document.body.appendChild(nextTriggerRoot);
    }
  };

  const mountTrigger = () => {
    renderTrigger();
  };

  const start = () => {
    ensureStyles(document);
    ensureShellRoot();
    mountTrigger();
    syncAllBindings();
    removeStoreListener = bridge.onStoreUpdate(() => {
      syncAllBindings();
    });

    observer = new MutationObserver(() => {
      mountTrigger();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  return {
    start,
    open,
    close,
    toggle,
    destroy() {
      removeStoreListener?.();
      removeStoreListener = null;
      fieldBindings.clear();
      observer?.disconnect();
      observer = null;
      shellRoot?.remove();
      triggerRoot?.remove();
      shellRoot = null;
      triggerRoot = null;
    },
  };
};
exports.createInjectedModShell = createInjectedModShell;
