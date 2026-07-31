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

    this.#validateFields()
  }

  #onInputChange(event) {
    console.log("input change");
    this.#validateFields()
  }

  #validateFields() {
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