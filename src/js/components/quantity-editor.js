class QuantityEditor extends HTMLElement {
  constructor() {
    super();
  }
}

if (!customElements.get("quantity-editor")) {
  customElements.define("quantity-editor", QuantityEditor);
}