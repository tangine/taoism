class VariantPicker extends HTMLElement{
  #abortController = undefined;
  constructor() {
    super();
  }

  connectedCallback(){
    this.addEventListener("change", this.#onInputChange.bind(this));
  }

  disconnectedCallback(){
    this.#abortController?.abort();
  }

  #onInputChange(event) {
    this.classList.toggle('loading');
    event.preventDefault();
    event.stopPropagation();
    const selectedOptions = this.querySelectorAll("fieldset input:checked");
    const options = []
    selectedOptions.forEach(option => {
      options.push(option.dataset);
    })
    this.#dispatch(options)
  }

  #dispatch(data) {
    this.dispatchEvent(new CustomEvent('variant:change', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        data
      }
    }));
  }
}

if(!customElements.get("variant-picker")){
  customElements.define("variant-picker", VariantPicker);
}

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
  #abortController = undefined
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("variant:change", this.#onVariantChange.bind(this));
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  #onVariantChange(event) {
    event.preventDefault();
    event.stopPropagation();

    const {data} = event.detail;

    const optionIds = data.map(item => item.id);

    this.#updateSection(optionIds);
  }

  #updateSection(optionIds = []) {
    this.classList.toggle("loading");
    const {sectionId, productUrl} = this.dataset;

    const url = new URL(`${location.origin}${productUrl}`);
    sectionId ? url.searchParams.set("sectionId", sectionId) : "";
    sectionId ? url.searchParams.set("option_values", optionIds.join(",")) : "";

    this.#abortController?.abort()
    this.#abortController = new AbortController();
    const {signal} = this.#abortController;

    fetch(url.toString(), {
      signal
    }).then(response => response.text())
      .then(text => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const section = html.getElementById(sectionId);
        if(section) {
          const productInfo = section.querySelector("product-info");
          const {selectedVariantId} = productInfo.dataset;
          if(selectedVariantId) {
            this.#replaceState(productUrl, selectedVariantId);
          }

          document.getElementById(sectionId).innerHTML = section.innerHTML;
        }
      }).catch(error => {
      console.log(error);
    }).finally(() => {
      this.classList.toggle("loading");
    })
  }

  #replaceState(productUrl, variantId) {
    const url = new URL(`${location.origin}${productUrl}`);

    if(variantId) {
      url.searchParams.set('variant', variantId)
    }

    history.replaceState({}, "", url.toString())
  }

  #addToCart() {
    console.log("addToCart");
  }
}

if(!customElements.get("product-info")){
  customElements.define("product-info", ProductInfo);
}

class ProductForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.querySelector("button[type='submit'][name='add-to-cart']").addEventListener("submit", this.#onSubmit.bind(this));
  }

  #onSubmit(event) {
    event.preventDefault();
  }
}

if(!customElements.get("product-form")){
  customElements.define("product-form", ProductForm);
}

class MediaGallery extends HTMLElement {

}

if(!customElements.get('media-gallery')) {
  customElements.define('media-gallery', MediaGallery);
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

  connectedCallback() {
    this.quantityInput = this.querySelector("input[type='number']");
    this.minusButton = this.querySelector("button[name='minus']");
    this.plusButton = this.querySelector("button[name='plus']");

    this.quantityInput.addEventListener("change", this.#onInputChange.bind(this))
    this.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", this.#onButtonClick.bind(this));
    })

    this.#validateQuantity()
  }

  #onButtonClick(event) {
    const button = event.target.closest("button.quantity__button");
    const name = button.getAttribute("name");
    if(name === 'plus') {
      this.quantityInput.stepUp()
      console.log("+")
    } else if(name === 'minus') {
      console.log("-")
      this.quantityInput.stepDown()
    }

    this.#validateQuantity()
  }

  #onInputChange(event) {
    console.log("input change");
    this.#validateQuantity()
  }

  #validateQuantity() {
    const quantity = this.quantityInput.value;
    const max = this.quantityInput.getAttribute("max");
    const min = this.quantityInput.getAttribute("min");

    if(max && quantity >= max) {
      this.plusButton.setAttribute("disabled", "disabled");
    } else {
      this.plusButton.removeAttribute("disabled");
    }

    if(min && quantity <= min) {
      this.minusButton.setAttribute("disabled", "disabled");
    } else {
      this.minusButton.removeAttribute("disabled");
    }

    if(this.quantityInput.min) {
      this.plusButton.classList.toggle("disabled");
    }
  }

  #updateQuantity() {
    this.dispatchEvent(new CustomEvent('quantity:change', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        quantity: this.quantityInput.value
      }
    }));
  }
}

if(!customElements.get("quantity-input")){
  customElements.define("quantity-input", QuantityInput);
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


class CartIcon extends HTMLElement {
  constructor() {
    super();
  }
}

if(!customElements.get('cart-icon')) {
  customElements.define('cart-icon', CartIcon);
}

class CartItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("quantity:change", this.#updateQuantity.bind(this));
    this.addEventListener("quantity:remove", this.#remove.bind(this));
  }

  #updateQuantity() {

  }

  #remove() {

  }
}

if(!customElements.get('cart-item')) {
  customElements.define('cart-item', CartItem);
}

class CartInfo extends HTMLElement {
  constructor() {
    super();
  }
}

if(!customElements.get('cart-info')) {
  customElements.define('cart-info', CartInfo);
}

class AccountIcon extends HTMLElement {
  constructor() {
    super();
  }
}

if(!customElements.get('account-icon')) {
  customElements.define('account-icon', AccountIcon);
}