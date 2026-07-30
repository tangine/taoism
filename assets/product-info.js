class ProductInfo extends HTMLElement {
  constructor() {
    super();
  }


}

if(!customElements.get("product-info")){
  customElements.define("product-info", ProductInfo);
}