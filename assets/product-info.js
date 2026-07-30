class ProductInfo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("variant:change", this.#onVariantChange.bind(this));
  }

  #onVariantChange(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.target.detail);
  }
}

if(!customElements.get("product-info")){
  customElements.define("product-info", ProductInfo);
}