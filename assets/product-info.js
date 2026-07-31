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

    this.#update_html(data);
  }

  #update_html(selectedOptions = []) {
    const {sectionId, productUrl} = this.dataset
    const optionIds = []

    selectedOptions.forEach(option => {
      optionIds.push(option.id)
    })

    this.#abortController?.abort()
    this.#abortController = new AbortController();
    fetch(`${productUrl}?sectionId=${sectionId}&option_values=${optionIds.join(',')}`, {
      signal: this.#abortController.signal
    })
      .then(response => response.text())
      .then((text) => {
      const section = new DOMParser().parseFromString(text, 'text/html');
      const productInfo = section.querySelector("product-info");
      const variantId = productInfo.dataset['selectedVariantId'];
      this.#replaceState(productUrl, variantId);
      document.getElementById(sectionId).innerHTML = section.getElementById(sectionId).innerHTML;
    })
  }

  #replaceState(productUrl, variant) {
    const url = `${productUrl}?variant=${variant}`;

    history.replaceState({}, "", url)
  }
}

if(!customElements.get("product-info")){
  customElements.define("product-info", ProductInfo);
}