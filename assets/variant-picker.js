class VariantPicker extends HTMLElement{
  constructor() {
    super();
  }

  connectedCallback(){
    this.addEventListener("change", this.#onInputChange.bind(this));
  }

  #onInputChange(event) {
    console.log(event.target.dataset);
  }

  #dispatch() {
    this.dispatchEvent(new CustomEvent('change'));
  }
}

if(!customElements.get("variant-picker")){
  customElements.define("variant-picker", VariantPicker);
}