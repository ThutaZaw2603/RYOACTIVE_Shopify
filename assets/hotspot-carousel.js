import { Component } from '@theme/component';

/**
 * A lightweight horizontally-scrollable carousel driven by native CSS scroll-snap.
 * Used on mobile to make the product hotspot image columns swipeable, with
 * prev/next buttons that scroll by one slide's width.
 * @extends {Component}
 */
class HotspotCarousel extends Component {
  next() {
    this.scrollBy({ left: this.clientWidth, behavior: 'smooth' });
  }

  previous() {
    this.scrollBy({ left: -this.clientWidth, behavior: 'smooth' });
  }
}

if (!customElements.get('hotspot-carousel-component')) {
  customElements.define('hotspot-carousel-component', HotspotCarousel);
}
