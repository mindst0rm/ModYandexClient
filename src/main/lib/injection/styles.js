"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.INJECTED_MOD_STYLE_ID = exports.injectedModStyles = void 0;

const INJECTED_MOD_STYLE_ID = "injected-mod-shell-style";
exports.INJECTED_MOD_STYLE_ID = INJECTED_MOD_STYLE_ID;

const injectedModStyles = `
#mod-shell-anchor {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  pointer-events: auto;
}

#mod-shell-anchor[data-placement="anchored"] {
  justify-content: flex-start;
  padding: 0;
  box-sizing: border-box;
}

.modShellTrigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  width: 100%;
  min-height: 44px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--ym-outline-color-primary-disabled, rgba(255,255,255,.08));
  background: var(--ym-surface-color-primary-enabled-list, rgba(255,255,255,.04));
  color: var(--ym-controls-color-primary-text-enabled_variant, #fff);
  box-shadow: 0 8px 24px rgba(0,0,0,.18);
  backdrop-filter: blur(18px);
  cursor: pointer;
  transition: transform .16s ease, background-color .16s ease, border-color .16s ease, box-shadow .16s ease;
}

#mod-shell-anchor[data-placement="fallback"] .modShellTrigger {
  box-shadow: 0 14px 28px rgba(0, 0, 0, .22);
}

.modShellTrigger:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--ym-surface-color-primary-enabled-list, rgba(255,255,255,.08)) 82%, white);
  border-color: var(--ym-outline-color-primary-enabled, rgba(255,255,255,.14));
  box-shadow: 0 14px 34px rgba(0, 0, 0, .24);
}

.modShellTrigger__logo {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 999px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  filter: drop-shadow(0 0 10px rgba(41, 196, 255, .22));
}

.modShellTrigger__text {
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
}

.modShellRoot {
  position: fixed;
  inset: 0;
  z-index: 999999;
  pointer-events: none;
}

.modShellBackdrop {
  position: absolute;
  inset: 0;
  background: rgba(7,10,18,.48);
  opacity: 0;
  transition: opacity .2s ease;
}

.modShellPanel {
  position: absolute;
  top: 0;
  left: 0;
  width: min(408px, 92vw);
  height: 100%;
  padding: 14px 14px 18px;
  background:
    linear-gradient(180deg, rgba(18,18,18,.98), rgba(18,18,18,.96)),
    var(--ym-background-color-primary-enabled-content, #111);
  color: var(--ym-controls-color-primary-text-enabled_variant, #fff);
  transform: translateX(-100%);
  transition: transform .22s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,.06);
  box-shadow: 22px 0 60px rgba(0,0,0,.42);
}

.modShellRoot[data-open="true"] {
  pointer-events: auto;
}

.modShellRoot[data-open="true"] .modShellBackdrop {
  opacity: 1;
}

.modShellRoot[data-open="true"] .modShellPanel {
  transform: translateX(0);
}

.modShellHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 18px;
  background: var(--ym-surface-color-primary-enabled-content, rgba(255,255,255,.03));
  border: 1px solid rgba(255,255,255,.06);
}

.modShellHeader__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modShellBrand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modShellBrand__logo {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 999px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.modShellBrand__copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.modShellEyebrow {
  font-size: 11px;
  line-height: 14px;
  color: rgba(255,255,255,.56);
  text-transform: uppercase;
  letter-spacing: .08em;
}

.modShellTitle {
  font-size: 15px;
  line-height: 18px;
  font-weight: 700;
}

.modShellSubtitle {
  font-size: 12px;
  line-height: 17px;
  color: rgba(255,255,255,.62);
}

.modShellClose {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.04);
  color: inherit;
  cursor: pointer;
}

.modShellStats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.modShellStat {
  padding: 12px 10px;
  border-radius: 16px;
  background: var(--ym-surface-color-primary-enabled-content, rgba(255,255,255,.04));
  border: 1px solid rgba(255,255,255,.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modShellStat__label {
  font-size: 11px;
  line-height: 14px;
  color: rgba(255,255,255,.6);
}

.modShellStat__value {
  font-size: 15px;
  line-height: 19px;
  font-weight: 700;
}

.modShellSection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modShellSection_card {
  padding: 0;
  border-radius: 16px;
  background: var(--ym-surface-color-primary-enabled-content, rgba(255,255,255,.04));
  border: 1px solid rgba(255,255,255,.06);
  overflow: hidden;
}

.modShellSection__title {
  font-size: 14px;
  line-height: 18px;
  color: rgba(255,255,255,.92);
  font-weight: 600;
}

.modShellSection__title_inline {
  margin-bottom: 2px;
}

.modShellSection__description {
  font-size: 12px;
  line-height: 17px;
  color: rgba(255,255,255,.62);
}

.modShellSection__summary {
  list-style: none;
  cursor: pointer;
  padding: 12px 14px;
}

.modShellSection__summary::-webkit-details-marker {
  display: none;
}

.modShellSection__summaryMain {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modShellSection__summaryMeta {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.modShellSection__chevron {
  color: rgba(255,255,255,.52);
  font-size: 16px;
  line-height: 1;
  transform: rotate(180deg);
  transition: transform .18s ease;
}

.modShellSection:not([open]) .modShellSection__chevron {
  transform: rotate(0deg);
}

.modShellActions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 14px 14px;
}

.modShellAction {
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.04);
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.modShellAction_primary {
  background: var(--ym-controls-color-primary-default-enabled-fill, linear-gradient(135deg, rgba(254,212,43,.96), rgba(255,193,52,.88)));
  color: #19170d;
  border-color: transparent;
  font-weight: 700;
}

.modShellToggles {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 14px 14px;
}

.modShellToggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.modShellToggle_column {
  align-items: stretch;
}

.modShellToggle:last-child {
  border-bottom: 0;
}

.modShellToggle__meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.modShellToggle__title {
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
}

.modShellToggle__description {
  font-size: 12px;
  line-height: 16px;
  color: rgba(255,255,255,.62);
}

.modShellSwitch {
  position: relative;
  width: 38px;
  height: 22px;
  flex: 0 0 38px;
  border: 0;
  border-radius: 999px;
  background: rgba(255,255,255,.2);
  cursor: pointer;
  transition: background-color .18s ease;
}

.modShellSwitch[data-checked="true"] {
  background: var(--ym-controls-color-primary-default-enabled-fill, #fed42b);
}

.modShellSwitch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
  transition: transform .18s ease;
}

.modShellSwitch[data-checked="true"] .modShellSwitch__thumb {
  transform: translateX(16px);
}

.modShellSelect,
.modShellInput {
  min-height: 40px;
  width: 100%;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.06);
  color: #fff;
  outline: none;
}

.modShellSelect option {
  color: #111;
}

.modShellPathField {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.modShellSettings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modShellFooter {
  margin-top: auto;
  padding: 0 10px;
  font-size: 12px;
  line-height: 16px;
  color: rgba(255,255,255,.55);
}

.modProjectNotice {
  position: fixed;
  inset: 0;
  z-index: 1000000;
  pointer-events: none;
}

.modProjectNotice[data-open="true"] {
  pointer-events: auto;
}

.modProjectNotice__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(9, 11, 18, 0.58);
  opacity: 0;
  transition: opacity .2s ease;
}

.modProjectNotice[data-open="true"] .modProjectNotice__backdrop {
  opacity: 1;
}

.modProjectNotice__card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(460px, calc(100vw - 32px));
  transform: translate(-50%, calc(-50% + 18px));
  padding: 24px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(93,117,255,.18), transparent 32%),
    radial-gradient(circle at bottom right, rgba(254,212,43,.12), transparent 28%),
    rgba(19, 21, 31, .97);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 24px 80px rgba(0,0,0,.42);
  color: #fff;
  opacity: 0;
  transition: opacity .22s ease, transform .22s ease;
}

.modProjectNotice[data-open="true"] .modProjectNotice__card {
  opacity: 1;
  transform: translate(-50%, -50%);
}

.modProjectNotice__badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.07);
  color: rgba(255,255,255,.68);
  font-size: 12px;
  line-height: 16px;
}

.modProjectNotice__title {
  margin: 16px 0 10px;
  font-size: 28px;
  line-height: 32px;
  font-weight: 700;
}

.modProjectNotice__copy {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255,255,255,.9);
}

.modProjectNotice__copy_muted {
  margin-top: 10px;
  color: rgba(255,255,255,.62);
}

.modProjectNotice__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.modProjectNotice__button {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: inherit;
  cursor: pointer;
  font-weight: 600;
}

.modProjectNotice__button_primary {
  background: linear-gradient(135deg, rgba(254,212,43,.96), rgba(255,193,52,.88));
  color: #17140c;
  border-color: transparent;
}

.modProjectNotice__button_secondary:hover,
.modProjectNotice__link:hover,
.modShellAction:hover,
.modShellClose:hover {
  background: rgba(255,255,255,.1);
}

.modProjectNotice__links {
  display: flex;
  gap: 14px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.modProjectNotice__link {
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(255,255,255,.68);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
`;
exports.injectedModStyles = injectedModStyles;
