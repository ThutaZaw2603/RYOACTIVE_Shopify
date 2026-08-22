import { Component } from '@theme/component';

/**
 * Toggles the size chart table between centimeters and inches.
 * @extends {Component}
 */
class SizeChart extends Component {
  toggleUnit(event) {
    const button = event.target;
    const isInches = this.getAttribute('data-unit') === 'in';
    const nextUnit = isInches ? 'cm' : 'in';

    this.setAttribute('data-unit', nextUnit);
    button.setAttribute('aria-pressed', String(!isInches));
  }
}

if (!customElements.get('size-chart-component')) {
  customElements.define('size-chart-component', SizeChart);
}
