class ProductCard extends HTMLElement {

  #onClick() {
    const {productUrl} = this.dataset;
    if(productUrl) {
      window.open(productUrl, '_self');
    }
  }
}

if(!customElements.get('product-card')) {
  customElements.define('product-card', ProductCard);
}

class ProductInfo extends HTMLElement {
  #onQuantityChange(event) {

  }

  #onVariantChange(event) {
    console.log("onVariantChange");
  }

  #replaceState(variant) {

  }

  #addedToCart() {
    console.log("added to cart");
  }
}

if(!customElements.get('product-info')) {
  customElements.define('product-info', ProductInfo);
}

class MediaGallery extends HTMLElement {

}

if(!customElements.get('media-gallery')) {
  customElements.define('media-gallery', MediaGallery);
}

class CartItem extends HTMLElement {
  removeButton = undefined
  constructor() {
    super();
  }

  connectedCallback() {
    this.querySelectorAll('button[name="remove"]').forEach(button => {
      button.addEventListener('click', this.#onRemove.bind(this));
    })
    this.addEventListener("quantity:change", this.#onQuantityChange.bind(this));
  }

  #onQuantityChange(event) {

  }

  #onRemove(event) {

  }
}

if(!customElements.get('cart-item')) {
  customElements.define('cart-item', CartItem);
}

class QuantityInput extends HTMLElement {
  quantityInput = undefined;
  minusButton = undefined;
  plusButton = undefined;

  constructor() {
    super();
  }
}
if(!customElements.get('quantity-input')) {
  customElements.define('quantity-input', QuantityInput);
}



class SlideShow extends HTMLElement {
  constructor() {
    super();
    this.currentIndex = 0;
  }
}

if(!customElements.get('slide-show')) {
  customElements.define('slide-show', SlideShow);
}