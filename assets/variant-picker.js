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
    const selectedOptions = this.querySelectorAll("fieldset input:checked");
    const optionIds = []
    selectedOptions.forEach(option => {
      optionIds.push(option.dataset["id"])
    })

    const {productUrl, sectionId} = this.dataset

    this.#abortController?.abort()
    this.#abortController = new AbortController();
    fetch(`${productUrl}?sectionId=${sectionId}&option_values=${optionIds.join(',')}`, {
      signal: this.#abortController.signal
    })
      .then(response => response.text())
      .then(text => {
        const newPage = new DOMParser().parseFromString(text, 'text/html');
        document.getElementById(sectionId).innerHTML = newPage.getElementById(sectionId).innerHTML;
        console.log("success");
      })
  }

  #dispatch() {
    this.dispatchEvent(new CustomEvent('change'));
  }
}

if(!customElements.get("variant-picker")){
  customElements.define("variant-picker", VariantPicker);
}