class ProductInfo extends HTMLElement {
  constructor() {
    super();
  }
}

if (!customElements.get('product-info')) {
  customElements.define('product-info', ProductInfo);
}

class ProductCard extends HTMLElement {
  constructor() {
    super();
  }
}

if (!customElements.get('product-card')) {
  customElements.define('product-card', ProductCard);
}

class VariantPicker extends HTMLElement {
  constructor() {
    super();
  }
}

if (!customElements.get("variant-picker")) {
  customElements.define("variant-picker", VariantPicker);
}