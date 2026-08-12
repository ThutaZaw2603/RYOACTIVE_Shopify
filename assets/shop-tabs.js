import { Component } from '@theme/component';

/**
 * Shop by tabs component. Switches which collection's product carousel
 * panel is visible based on the active tab.
 *
 * @extends {Component}
 */
class ShopTabs extends Component {
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', this.#handleClick);
    window.addEventListener('resize', this.#syncHeight);
    this.#syncHeight();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('resize', this.#syncHeight);
  }

  /**
   * @param {MouseEvent} event
   */
  #handleClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const tab = target.closest('[role="tab"]');
    if (!tab) return;

    const panelId = tab.getAttribute('aria-controls');
    const panel = panelId ? this.querySelector(`#${CSS.escape(panelId)}`) : null;
    if (!panel) return;

    for (const otherTab of this.querySelectorAll('[role="tab"]')) {
      otherTab.setAttribute('aria-selected', String(otherTab === tab));
    }

    for (const otherPanel of this.querySelectorAll('[role="tabpanel"]')) {
      otherPanel.toggleAttribute('hidden', otherPanel !== panel);
    }

    this.#syncHeight();
  };

  /**
   * On desktop the visible panel is position: absolute (so a tall carousel doesn't
   * stretch the sidebar's rows — see blocks/tab.liquid), which means it no longer
   * contributes to this component's height on its own. Measure it directly and
   * apply that as this component's min-height instead of guessing a fixed number,
   * so there's no leftover empty space when the real content is shorter. Mobile
   * ignores this (the panel is in normal flow there), but re-measuring on resize
   * still matters so a stale desktop-sized value isn't left over from before a
   * viewport change (e.g. rotating a device, or toggling preview width in the
   * theme editor without a full page reload).
   */
  #syncHeight = () => {
    const panel = this.querySelector('.shop-tabs__panel:not([hidden])');
    if (!panel) return;

    this.style.setProperty('--shop-tabs-content-height', `${panel.getBoundingClientRect().height}px`);
  };
}

if (!customElements.get('shop-tabs-component')) {
  customElements.define('shop-tabs-component', ShopTabs);
}
