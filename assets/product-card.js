class ProductCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('product-card');
  }

  #handleClick() {
    const {productUrl} = this.dataset;

    if(productUrl) {
      window.open(productUrl, '_self')
    };
  }

  #getSectionId() {
    return this.dataset.sectionId;
  }

  #getProductUrl() {
    return this.dataset.productUrl;
  }

  #getSelectedVariantId() {
    return this.dataset.selectedVariantId;
  }

  #getProductId() {
    return this.dataset.productId;
  }
}