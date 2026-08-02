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
    const {sectionId, productUrl} = this.dataset['SectionId'];

    const url = new URL(productUrl);
    sectionId ? url.searchParams.set("sectionId", sectionId) : "";
    sectionId ? url.searchParams.set("option_values", optionIds.join(",")) : "";

    this.#abortController?.abort()
    this.#abortController = new AbortController();
    const {signal} = this.#abortController;

    fetch(url.toString(), {
      signal
    }).then(response => response.text())
      .then(text => {
        console.log(text);
        const html = new DOMParser().parseFromString(text, 'text/html');
        const section = html.getElementById(sectionId);
        const productInfo = section.querySelector("product-info");
        const {selectedVariantId} = productInfo.dataset;
        if(selectedVariantId) {
          this.#replaceState(productUrl, selectedVariantId);
        }

      }).catch(error => {
        console.log(error);
    })
  }

  #replaceState(productUrl, variantId) {
    const url = new URL(productUrl);

    if(variantId) {
      url.searchParams.set('variant', variantId)
    }

    history.replaceState({}, "", url.toString())
  }
}

if(!customElements.get("product-info")){
  customElements.define("product-info", ProductInfo);
}