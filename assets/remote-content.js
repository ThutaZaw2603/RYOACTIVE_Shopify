import { Component } from '@theme/component';

/**
 * Fetches another page's rendered content and injects it into this element.
 * Used to show a page's section content (e.g. a size chart page) inside a
 * popup/drawer that lives on a different page.
 * @extends {Component}
 */
class RemoteContent extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#load();
  }

  async #load() {
    const url = this.getAttribute('data-url');
    if (!url) return;

    try {
      const response = await fetch(url);
      if (!response.ok) return;

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const source = doc.getElementById('MainContent');

      if (source) this.innerHTML = source.innerHTML;
    } catch (error) {
      console.error('[remote-content-component] Failed to load content', error);
    }
  }
}

if (!customElements.get('remote-content-component')) {
  customElements.define('remote-content-component', RemoteContent);
}
