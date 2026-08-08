import {parseIntOrDefault} from "./utils";

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

    const options = selectedOptions.map(option => {
      return option.dataset;
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

    fetch(url.toString(), {signal})
      .then(response => response.text())
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
    this.querySelector("button[name='add-to-cart']").addEventListener("click", this.#onSubmit.bind(this));
  }

  #onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = this.querySelector("form");
    const formData = new FormData(form);
    // formData.append("quantity", String(1));
    console.log(formData);

    fetch(window.routes.cart_add_url, {
      method: "POST",
      body: formData
    }).then(response => response.json())
    .then(response => {
      if(response.status) {

      }
      console.log(response);
    }).catch(error => {
      console.log(error);
    })
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


class AddToCart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", this.#onClick.bind(this));
  }

  disconnectedCallback() {

  }

  #onClick(event) {
    event.preventDefault();
    this.classList.toggle("loading", true);
  }
}
if(!customElements.get('add-to-cart')) {
  customElements.define('add-to-cart', AddToCart);
}


class QuantityEditor extends HTMLElement {
  quantityInput = undefined;
  minusButton = undefined;
  plusButton = undefined;
  removeButton = undefined;
  constructor() {
    super();
  }

  connectedCallback() {
    this.quantityInput = this.querySelector("input[type='number']");
    this.minusButton = this.querySelector("button[name='minus']");
    this.plusButton = this.querySelector("button[name='plus']");
    this.removeButton = this.querySelector("button[name='remove']");

    this.quantityInput.addEventListener("change", this.#onInputChange.bind(this))
    this.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", this.#onButtonClick.bind(this));
    })

    this.#validateQuantity()
    this.#updateButtonStates()
  }

  #onButtonClick(event) {
    const button = event.target.closest("button.quantity-editor__button");
    const name = button.getAttribute("name");
    if(name === 'plus') {
      this.quantityInput.stepUp()
      console.log("+")
    } else if(name === 'minus') {
      console.log("-")
      this.quantityInput.stepDown()
    } else if(name === 'remove') {
      console.log("remove")
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

  #getCurrentValues() {
    return {
      min: parseIntOrDefault(this.quantityInput.min, 1),
      max: parseIntOrDefault(this.quantityInput.max, null),
      step: parseIntOrDefault(this.quantityInput.step, 1),
      value: parseIntOrDefault(this.quantityInput.value, 0),
    }
  }

  #updateButtonStates() {
    const {min, max, step, value} = this.#getCurrentValues();
    this.minusButton.disabled = value <= min;
    this.plusButton.disabled = max !== null && value >= max
  }

  #updateQuantity(quantity) {
    this.dispatchEvent(new CustomEvent('quantity:change', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        quantity
      }
    }));
  }
}
if(!customElements.get("quantity-editor")){
  customElements.define("quantity-editor", QuantityEditor);
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

class CartRemove extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", event => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent('cart-remove', {
        bubbles: true,
        cancelable: true,
        detail: {}
      }));
    })
  }
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