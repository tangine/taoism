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
    console.log("variant:change", data);
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