class QuantityInput extends HTMLElement {
  quantityInput = undefined;
  constructor() {
    super();
  }

  connectedCallback() {
    this.quantityInput = this.querySelector("input[type='number']");
    this.quantityInput.addEventListener("change", this.#onInputChange.bind(this))
    this.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", this.#onButtonClick.bind(this));
    })
  }

  #onButtonClick(event) {
    console.log(event.target);
    const name = event.target.getAttribute("name");
    if(name === 'plus') {
      this.quantityInput.stepUp()
      console.log("+")
    } else if(name === 'minus') {
      console.log("-")
      this.quantityInput.stepDown()
    }
  }

  #onInputChange(event) {
    console.log("input change");
  }

  #updateQuantity() {
    this.dispatchEvent(new CustomEvent('quantity:change', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {}
    }));
  }
}

if(!customElements.get("quantity-input")){
  customElements.define("quantity-input", QuantityInput);
}