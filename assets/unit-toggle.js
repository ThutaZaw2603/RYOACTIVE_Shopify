import { Component } from '@theme/component';

const CM_PATTERN = /(\d+(?:\.\d+)?)\s*cm\b/gi;

/**
 * Renders a CM/IN toggle button and, on first use, rewrites any "NN cm"
 * text found in the sibling content element into a cm/in pair so both
 * units can be shown/hidden via CSS based on this element's data-unit
 * attribute.
 * @extends {Component}
 */
class UnitToggle extends Component {
  #converted = false;

  toggleUnit(event) {
    const button = event.currentTarget;
    const isInches = this.getAttribute('data-unit') === 'in';
    const nextUnit = isInches ? 'cm' : 'in';

    this.#convertNumbers();
    this.setAttribute('data-unit', nextUnit);
    button.setAttribute('aria-pressed', String(!isInches));
  }

  #convertNumbers() {
    if (this.#converted) return;

    const target = this.nextElementSibling;
    if (!target) return;

    this.#converted = true;

    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        CM_PATTERN.lastIndex = 0;
        return CM_PATTERN.test(node.textContent ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    for (const textNode of nodes) {
      const text = textNode.textContent ?? '';
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      CM_PATTERN.lastIndex = 0;
      let match;

      while ((match = CM_PATTERN.exec(text))) {
        if (match.index > lastIndex) fragment.append(text.slice(lastIndex, match.index));

        const cmValue = Number.parseFloat(match[1]);
        const inValue = Math.round(cmValue * 0.393701 * 10) / 10;

        const wrapper = document.createElement('span');
        wrapper.setAttribute('data-unit-pair', '');

        const cmSpan = document.createElement('span');
        cmSpan.setAttribute('data-unit-value', 'cm');
        cmSpan.textContent = `${cmValue} cm`;

        const inSpan = document.createElement('span');
        inSpan.setAttribute('data-unit-value', 'in');
        inSpan.textContent = `${inValue} in`;

        wrapper.append(cmSpan, inSpan);
        fragment.append(wrapper);

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) fragment.append(text.slice(lastIndex));

      textNode.replaceWith(fragment);
    }
  }
}

if (!customElements.get('unit-toggle-component')) {
  customElements.define('unit-toggle-component', UnitToggle);
}
